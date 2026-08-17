import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Portfolio } from "src/portfolio/portfolio.schema";
import { IPortfolio } from "./portfolio.interface";
import mongoose, { Model } from "mongoose";
import { UploadService } from "src/upload/upload.service";
import { WorkshopQueryFilter } from "src/interfaces/workshop-query-filter";

@Injectable()
export class PortfolioService {
    constructor(
        @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
        private uploadService: UploadService
    ) {}

    async addPortfolio(
        portfolio: IPortfolio
    ): Promise<Portfolio | null> {
        return await this.portfolioModel.create(portfolio)
    }

    async getById(id: mongoose.Types.ObjectId): Promise<Portfolio | null> {
        return await this.portfolioModel.findById(id);
    }

    async getItems(queryOb: WorkshopQueryFilter) {
        const { query, student } = queryOb;
        const options = {}
        if (query || student) {
            options['$or'] = [];
            if (query) {
                options['$or'].push({'heading.en': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'heading.am': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'description.en': {$regex: new RegExp(query), $options:"i"}});
                options['$or'].push({'description.hy': {$regex: new RegExp(query), $options:"i"}});
            }
            if (student) options['$or'].push({ 'students.username': student });   
        }
        return await this.portfolioModel
            .find(Object.keys(options).length ? options : {})
            .populate('workshop', 'title')
            .populate('student', 'username')
            .exec();
    }
}