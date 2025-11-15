import { BadRequestException, Injectable } from "@nestjs/common";
import { Workshop, WorkshopDocument } from "./workshop.schema";
import mongoose, { Model, Types } from "mongoose";
import { WorkshopDTO } from "./workshop.dto";
import { InjectModel } from "@nestjs/mongoose";
import { UploadService } from "src/upload/upload.service";

@Injectable()
export class WorkshopService {
  constructor(
    @InjectModel(Workshop.name) private workshopModel: Model<WorkshopDocument>,
    private uploadService: UploadService
  ) {}

  async addWorkshop(
    workshopDto: WorkshopDTO,
    coverPhoto: Express.Multer.File
  ): Promise<Workshop> {
    const createdWorkshop = new this.workshopModel(workshopDto);
    if (coverPhoto) {
      const imgUrl = await this.uploadImg(coverPhoto, workshopDto["title"]["en"]);
      createdWorkshop.cover_photo = imgUrl;
    }
    return createdWorkshop.save();
  }

  private async uploadImg(
    img: Express.Multer.File,
    name: string,
  ): Promise<string> {
    const rnd = Math.floor(Math.random() * 1000000);
    const publicId = `workshop_${name.toLowerCase().replace(/ /g, "_")}_${rnd}`;
    const uploadResult = await this.uploadService.uploadFile(
      img,
      publicId,
      'workshop_data'
    );
    return uploadResult['url'];
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
        options['$or'].push({'title.en': {$regex: new RegExp(query), $options:"i"}});
        options['$or'].push({'title.am': {$regex: new RegExp(query), $options:"i"}});
        options['$or'].push({'description.en': {$regex: new RegExp(query), $options:"i"}});
        options['$or'].push({'description.hy': {$regex: new RegExp(query), $options:"i"}});
      }
      if (student) options['$or'].push({ students: student });
    }
    return this.workshopModel.find(options).populate('students').exec();
  }

  async updateWorkshop(
    id: mongoose.Types.ObjectId,
    workshopDto: WorkshopDTO,
    coverPhoto: Express.Multer.File
  ): Promise<Workshop> {
    const workshop = this.workshopModel.findByIdAndUpdate(id, workshopDto);
    if (coverPhoto) {
      const tmp = await this.workshopModel.findById(id);
      const publicId = this.uploadService.getPublicId(tmp.cover_photo);
      await this.uploadService.removeFile(publicId);
      const imgUrl = await this.uploadImg(coverPhoto, tmp.title.en);
      tmp.cover_photo = imgUrl;
      return tmp.save();
    }
    return workshop;
  }

  async deleteWorkshop(id: mongoose.Types.ObjectId): Promise<Workshop> {
    const tmp = await this.workshopModel.findById(id);
    const img = this.uploadService.getPublicId(tmp.cover_photo);
    const workshop = this.workshopModel.findByIdAndDelete(id);
    this.uploadService.removeFile(img).then(console.log);
    return workshop;
  }

  async registerStudedntToWorkshop(
    workshopId: mongoose.Types.ObjectId,
    student: string
  ): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopId);
    if (workshop.students.some((x) => x.equals(student)))
      throw new BadRequestException('This user has already registered to the workshop.');
    workshop.students.push(new Types.ObjectId(student));
    return this.workshopModel.findByIdAndUpdate(workshopId, workshop);
  }

  async unregisterStudedntToWorkshop(
    workshopId: mongoose.Types.ObjectId,
    student: string
  ): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopId);
    const id = workshop.students.findIndex(x => x.equals(student))
    if (id < 0)
      throw new BadRequestException("This user haven't registered to this workshop.");
    workshop.students.splice(id, 1);
    return this.workshopModel.findByIdAndUpdate(workshopId, workshop);
  }
}