import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Workshop } from "./workshop.schema";
import { Student } from "src/students/student.schema";
import { Staff } from "src/staff/staff.schema";
import { Announcement } from "./announcement.schema";
import { Assignment } from "./assignment.schema";
import { Comment } from "./comment.schema";
import { Attendee } from './attendee.schema';
import { AssignmentUpload } from './assignment-upload.schema';
import { WorkshopDetails } from "./workshop-details.schema";
import mongoose, { Model } from "mongoose";
import { IWorkshop } from "./workshop.interface";
import { WorkshopQueryFilter } from "src/interfaces/workshop-query-filter";
import { UploadService } from "src/upload/upload.service";
import { AttendanceStatus } from './attendance-status.enum'
import { UserType } from 'src/enums/user-type.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class WorkshopService {
    constructor(
        @InjectModel(Workshop.name) private workshopModel: Model<Workshop>,
        @InjectModel(Announcement.name) private announcementModel: Model<Announcement>,
        @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
        @InjectModel(AssignmentUpload.name) private assignmentUploadModel: Model<AssignmentUpload>,
        @InjectModel(WorkshopDetails.name) private workshopDetailsModel: Model<WorkshopDetails>,
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
        return await this.workshopModel
            .find(Object.keys(options).length ? options : {})
            .populate('coach', 'username fullName email')
            .populate('students', 'username fullName email')
            .exec();
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

    async loadAttendees(workshop: mongoose.Types.ObjectId) {
        return await this.attendeeModel.find({workshop})
    }

    async loadWorkshopDashboard(workshop: mongoose.Types.ObjectId) {
        return await this.workshopDetailsModel.findOne({workshop})
    }

    async setAttendanceStatus(workshop: mongoose.Types.ObjectId, user: mongoose.Types.ObjectId, date: Date, status: AttendanceStatus) {
        return await this.attendeeModel.findOneAndUpdate({
            workshop, user,
            date: {
                $gte: date,
                $lt: new Date(date.getTime() + 24*3600*1000)
            }
        }, {status})
    }

    async loadAnnouncement(announId: mongoose.Types.ObjectId) {
        return await this.announcementModel.findById(announId)
            .populate('user', 'username email')
            .populate('comments')
            .populate('comments.user')
    }

    async loadAssignment(assignId: mongoose.Types.ObjectId) {
        return await this.assignmentModel.findById(assignId)
            .populate('user', 'username firstName lastName email')
            .populate('comments')
            .populate('comments.user')
            .populate('privateComments')
            .populate('privateComments.user', 'usrename fullName email')
            .populate('uploads')
            .populate('uploads.user', 'username fullName email')
    }

    async uploadAssignment(user: mongoose.Types.ObjectId, assignId: mongoose.Types.ObjectId, files: Express.Multer.File[]) {
        const fileUrls = (await Promise.all(
            files.map((x, i)=>{
                return this.uploadService.uploadFile(x, `assignment_${assignId}_${user}_${i}`, 'workshop_assignment_works')
            })
        )).map(x=>x['url']);

        const assignment = await this.assignmentModel.findById(assignId)
            .populate<{uploads: AssignmentUpload[]}>('uploads', 'user')
        const studentUpload = assignment?.uploads?.find(x=>{
            if (typeof x == 'object' && x !== null && 'user' in x) {
                if (x.user.equals(user)) return true;
            }
            return false;
        })
        if (!studentUpload) {
            const upload = await this.assignmentUploadModel.create({
                user,
                files: fileUrls
            });
            return await this.assignmentUploadModel.findByIdAndUpdate(
                assignId,
                {
                    $push: { uploads: new mongoose.Types.ObjectId(upload._id) }
                },
                {
                    new: true
                }
            ).exec()
        } else {
            studentUpload.files = fileUrls;
            return assignment?.save();
        }
    }

    async leaveCommentInAnnouncement(
        user: mongoose.Types.ObjectId,
        userType: UserType,
        announId: mongoose.Types.ObjectId,
        content: string
    ) {
        const comment = await this.commentModel.create({
            user, userType, content, date: new Date()
        })
        return await this.announcementModel.findByIdAndUpdate(
            announId,
            {
                $push: { comments: new mongoose.Types.ObjectId(comment._id) }
            },
            {
                new: true
            }
        ).exec()
    }

    async leaveCommentInAssignment(
        user: mongoose.Types.ObjectId,
        userType: UserType,
        assignId: mongoose.Types.ObjectId,
        content: string
    ) {
        const comment = await this.commentModel.create({
            user, userType, content, date: new Date()
        })
        return await this.assignmentModel.findByIdAndUpdate(
            assignId,
            {
                $push: { comments: new mongoose.Types.ObjectId(comment._id) }
            },
            { new: true }
        ).exec()
    }

    async leavePrivateComment(
        user: mongoose.Types.ObjectId,
        userType: UserType,
        assignId: mongoose.Types.ObjectId,
        content: string
    ) {
        const comment = await this.commentModel.create({
            user, userType, content, date: new Date()
        })
        return await this.assignmentModel.findByIdAndUpdate(
            assignId,
            {
                $push: { privateComments: new mongoose.Types.ObjectId(comment._id) }
            },
            { new: true }
        ).exec()
    }

    async createAnnouncement(
        workshop: mongoose.Types.ObjectId,
        user: mongoose.Types.ObjectId,
        userType: UserType,
        content: string,
        files: Express.Multer.File[] = []
    ) {
        const attachId = randomUUID();
        const fileUrls = (await Promise.all([
            files.map((x, i)=>{
                return this.uploadService.uploadFile(x, `announcement_attachment_${attachId}_${user}_${i}`, 'workshop_announcement_attachments')
            })
        ])).map(x=>x['url']);
        const announ = await this.announcementModel.create({user, userType, content, files: fileUrls, date: new Date()})
        return await this.workshopModel.findByIdAndUpdate(
            workshop,
            {
                $push: { announcements: new mongoose.Types.ObjectId(announ._id) }
            },
            { new: true }
        ).exec()
    }

    async editAnnouncement(
        id: mongoose.Types.ObjectId,
        content: string
    ) {
        return await this.announcementModel.findByIdAndUpdate(id, {content})
    }

    async deleteAnnouncement(id: mongoose.Types.ObjectId) {
        const announ = await this.announcementModel.findById(id);
        if (announ?.attachments && announ?.attachments.length) {
            await Promise.all(
                announ.attachments.map(x=>{
                    const avatar = this.uploadService.getPublicId(x);
                    return this.uploadService.removeFile(avatar)
                })
            )
        }
        await this.commentModel.deleteMany({
            _id: { $in: announ?.comments }
        })
        await this.announcementModel.findByIdAndDelete(id)
        return await this.workshopModel.findByIdAndUpdate(
            announ?.workshop,
            {
                $pull: { announcements: new mongoose.Types.ObjectId(announ?._id) }
            },
            { new: true }
        ).exec()
    }

    async loadOngoingAssignments(user: mongoose.Types.ObjectId) {
        const workshopIds = (await this.workshopModel.find({
            students: new mongoose.Types.ObjectId(user)
        }).exec()).map(x=>new mongoose.Types.ObjectId(x._id));
        return await this.assignmentModel.find({
            workshop: { $in: workshopIds }
        }).populate('workshop', 'title')
        .exec() 
    }

    async createAssignment(
        workshop: mongoose.Types.ObjectId,
        user: mongoose.Types.ObjectId,
        content: string,
        deadline: Date | null
    ) {
        const assign = await this.assignmentModel.create({user, content, date: new Date(), deadline})
        return await this.workshopModel.findByIdAndUpdate(
            workshop,
            {
                $push: { assignments: new mongoose.Types.ObjectId(assign._id) }
            },
            { new: true }
        ).exec()
    }

    async editAssignment(
        id: mongoose.Types.ObjectId,
        content: string,
        deadline: Date | null
    ) {
        return await this.assignmentModel.findByIdAndUpdate(id, {content, deadline})
    }

    async deleteAssignment(id: mongoose.Types.ObjectId) {
        const assign = await this.assignmentModel.findById(id);
        if (assign) {
            await this.commentModel.deleteMany({
                _id: { $in: [...assign.comments, ...assign.privateComments] }
            })
            await this.assignmentModel.findByIdAndDelete(id)
            return await this.workshopModel.findByIdAndUpdate(
                assign.workshop,
                {
                    $pull: { assignments: new mongoose.Types.ObjectId(assign._id) }
                },
                { new: true }
            ).exec()
        }
        return null
    }

    async gradeWork(workId: mongoose.Types.ObjectId, score: number) {
        return await this.assignmentUploadModel.findByIdAndUpdate(workId, {score});
    }
}