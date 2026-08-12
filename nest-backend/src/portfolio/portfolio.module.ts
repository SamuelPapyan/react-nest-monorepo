import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Portfolio, PortfolioSchema } from "./portfolio.schema";
import { PortfolioService } from "./portfolio.service"
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { UploadService } from "src/upload/upload.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Portfolio.name, schema: PortfolioSchema }])
    ],
    providers: [PortfolioService, UploadService]
})
export class PortfolioModule {}