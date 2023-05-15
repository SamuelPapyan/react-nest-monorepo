import mongoose, { Model } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StaffDTO } from "src/staff/staff.dto";
import {Staff, StaffDocument } from 'src/staff/staff.schema'
import * as bcrypt from 'bcrypt'
import { hashConfig } from '../app/config'

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    ){}

    async addStaff(staffDTO: StaffDTO): Promise<Staff> {
        staffDTO.password = await bcrypt.hash(staffDTO.password, hashConfig.SALT_OR_ROUNDS);
        const createdStaff = new this.staffModel(staffDTO);
        return createdStaff.save();
    }
    
    async getById(id: mongoose.Types.ObjectId): Promise<Staff> {
        const staff = this.staffModel.findById(id);
        return staff;
    }

    async getStaffs(): Promise<Staff[]> {
        return this.staffModel.find().exec();
    }

    async updateStaff(
        id: mongoose.Types.ObjectId,
        staffDto: StaffDTO,
    ): Promise<Staff> {
        staffDto.password = await bcrypt.hash(staffDto.password, hashConfig.SALT_OR_ROUNDS);
        const staff = this.staffModel.findByIdAndUpdate(id, staffDto);
        return staff;
    }

    async deleteStaff(id: mongoose.Types.ObjectId): Promise<Staff> {
        const student = this.staffModel.findByIdAndDelete(id);
        return student;
    }
}