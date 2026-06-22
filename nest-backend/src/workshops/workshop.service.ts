import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Workshop } from "./workshop.schema";
import mongoose, { Model } from "mongoose";
import { IWorkshop } from "./workshop.interface";
import { WorkshopQueryFilter } from "src/interfaces/workshop-query-filter";
import { UploadService } from "src/upload/upload.service";

@Injectable()
export class WorkshopService {
    constructor(
        @InjectModel(Workshop.name) private workshopModel: Model<Workshop>,
        private uploadService: UploadService
    ) {}

    async addWorkshop(
        workshop: IWorkshop,
        coverPhoto: Express.Multer.File
    ): Promise<Workshop | null> {
        const newWorkshop = new this.workshopModel(workshop);
        if (coverPhoto) {
            const imgUrl = await this.uploadService.uploadImg(coverPhoto, workshop.title.en);
            newWorkshop.coverPhoto = imgUrl;
        }
        return await newWorkshop.save();
    }

    async getById(id: mongoose.Types.ObjectId): Promise<Workshop | null> {
        return await this.workshopModel.findById(id);
    }

    async getWorkshops(queryOb: WorkshopQueryFilter) {
        const { query, student } = queryOb;
        const options = {}
        if (query || student) {
            options['$or'] = [];
            if (query) {
                options['$or'].push({'title.en': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'title.am': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'description.en': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'description.hy': {$regex: new RegExp(query), $options:"i"}});
            }
            if (student) options['$or'].push({ 'students.username': student });   
        }
        const workshops = await this.workshopModel.aggregate([
            {
                $lookup: {
                    from: 'students',
                    localField: 'students',
                    foreignField: '_id',
                    as: 'students'
                }
            },
            {
                $unwind: {
                    path: '$students',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'coach',
                    foreignField: '_id',
                    as: 'coach'
                }
            },
            {
                $unwind: {
                    path: '$coach',
                    preserveNullAndEmptyArrays: true
                }
            },
            ...(Object.keys(options).length ? [{ $match: options }] : [])
        ])
        // return workshops;
        return await this.workshopModel.find(Object.keys(options).length ? options : {}).populate('coach', 'username fullName email').populate('students', 'username fullName email').exec();
    }

    async updateWorkshop(
        id: mongoose.Types.ObjectId,
        workshop: IWorkshop,
        coverPhoto: Express.Multer.File
    ): Promise<Workshop | null> {
        const updated = await this.workshopModel.findByIdAndUpdate(id, workshop);
        if (coverPhoto) {
            const tmp = await this.workshopModel.findById(id);
            if (!tmp) throw new NotFoundException();
            const publicId = this.uploadService.getPublicId(tmp.coverPhoto);
            await this.uploadService.removeFile(publicId);
            const imgUrl = await this.uploadService.uploadImg(coverPhoto, tmp.title.en);
            tmp.coverPhoto = imgUrl
            return await tmp.save();
        }
        return updated;
    }

    async deleteWorkshop(id: mongoose.Types.ObjectId): Promise<Workshop | null> {
        const tmp = await this.workshopModel.findById(id);
        if (!tmp) throw new NotFoundException();
        const img = this.uploadService.getPublicId(tmp.coverPhoto);
        const workshop = this.workshopModel.findByIdAndDelete(id);
        return await this.workshopModel.findByIdAndDelete(id);
    }

    async registerStudentToWorkshop(
        workshopId: mongoose.Types.ObjectId,
        studentId: mongoose.Types.ObjectId
    ): Promise<Workshop | null> {
        const workshop = await this.workshopModel.findById(workshopId);
        console.log(workshop?.students);
        if (!workshop) throw new NotFoundException();
        if (!workshop.students) workshop.students = [];
        if (workshop.students.some(x => x.equals(studentId)))
            throw new BadRequestException("This user has already registered to the workshop.");
        workshop.students.push(new mongoose.Types.ObjectId(studentId));
        return await this.workshopModel.findByIdAndUpdate(workshopId, workshop);
    }

    async unregisterStudedntToWorkshop(
        workshopId: mongoose.Types.ObjectId,
        studentId: mongoose.Types.ObjectId
    ): Promise<Workshop | null> {
        const workshop = await this.workshopModel.findById(workshopId);
        if (!workshop) throw new NotFoundException();
        const id = workshop.students.findIndex(x => x.equals(studentId))
        if (id < 0)
            throw new BadRequestException("This user haven't registered to this workshop.");
        workshop.students.splice(id, 1);
        return await this.workshopModel.findByIdAndUpdate(workshopId, workshop);
    }
}