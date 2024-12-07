import { BadRequestException, Injectable } from "@nestjs/common";
import { Workshop, WorkshopDocument } from "./workshop.schema";
import mongoose, { Model } from "mongoose";
import { WorkshopDTO } from "./workshop.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class WorkshopService {
    constructor(
        @InjectModel(Workshop.name) private workshopModel: Model<WorkshopDocument>,
    ) {}

    async addWorkshop(workshopDto: WorkshopDTO): Promise<Workshop> {
        const createdWorkshop = new this.workshopModel(workshopDto);
        return createdWorkshop.save();
    }

    async getById(id: mongoose.Types.ObjectId): Promise<Workshop> {
        const workshop = this.workshopModel.findById(id);
        return workshop;
    }

    async getWorkshops(query: string, student: string): Promise<Workshop[]> {
        const options = {}
        if (query || student) {
            options['$or'] = [];
            if (query) {
                options['$or'].push({title_en: {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({title_hy: {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({description_en: {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({description_hy: {$regex: new RegExp(query), $options:"i"}});
            }
            if (student)
                options['$or'].push({students: student});
        }
        
        return this.workshopModel.find(options).exec();
    }

    async updateWorkshop(
        id: mongoose.Types.ObjectId,
        workshopDto: WorkshopDTO,
    ): Promise<Workshop> {
        const workshop = this.workshopModel.findByIdAndUpdate(id, workshopDto);
        return workshop;
    }

    async deleteWorkshop(id: mongoose.Types.ObjectId): Promise<Workshop> {
        const workshop = this.workshopModel.findByIdAndDelete(id);
        return workshop;
    }

    async registerStudedntToWorkshop(
        workshopId: mongoose.Types.ObjectId,
        student: string
    ): Promise<Workshop> {
        const workshop = await this.workshopModel.findById(workshopId);
        if (workshop.students.some(x=>x === student))
            throw new BadRequestException("This user has already registered to the workshop.");
        workshop.students.push(student)
        return this.workshopModel.findByIdAndUpdate(workshopId, workshop);
    }

    async unregisterStudedntToWorkshop(
        workshopId: mongoose.Types.ObjectId,
        student: string
    ): Promise<Workshop> {
        const workshop = await this.workshopModel.findById(workshopId);
        const id = workshop.students.findIndex(x=>x === student)
        if (id < 0)
            throw new BadRequestException("This user haven't registered to this workshop.");
        workshop.students.splice(id, 1);
        return this.workshopModel.findByIdAndUpdate(workshopId, workshop);
    }
}