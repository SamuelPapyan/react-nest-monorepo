import { Injectable } from "@nestjs/common";
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

    async getWorkshops(query: string): Promise<Workshop[]> {
        const options = {}
        if (query) {
            options['$or'] = [];
            options['$or'].push({title: {$regex: new RegExp(query), $options:"i"}});
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
}