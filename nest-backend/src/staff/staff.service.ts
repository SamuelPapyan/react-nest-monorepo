import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Staff, StaffDocument } from "./staff.schema";
import { ResetPassword } from "src/reset-password/reset-password.schema";
import mongoose, { Model } from "mongoose";
import { IStaff } from "./staff.interface";
import { StaffQueryFilter } from "src/interfaces/staff-query-filter";
import { UploadService } from "src/upload/upload.service";
import { UserType } from "src/enums/user-type.enum";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { Country } from "src/country/country.schema";
import { ICountry } from "src/country/country.interface";
import { StaffRole } from "src/enums/staff-role.enum";

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
        @InjectModel(ResetPassword.name) private resetPasswordModel: Model<ResetPassword>,
        @InjectModel(Country.name) private countryModel: Model<Country>,
        private uploadService: UploadService,
        private jwtService: JwtService
    ) {}

    async addStaff(
        staff: IStaff,
        avatar: Express.Multer.File
    ): Promise<Staff | null> {
        const newStaff = new this.staffModel(staff);
        if (avatar) {
            const avatarUrl = await this.uploadService.uploadAvatar(avatar, staff.username, UserType.STAFF);
            newStaff.avatar = avatarUrl;
        }
        return await newStaff.save();
    }

    async findOne(username: string): Promise<StaffDocument | null> {
        return await this.staffModel.findOne({ username });
    }

    async getById(id: mongoose.Types.ObjectId): Promise<StaffDocument | null> {
        return await this.staffModel.findById(id);
    }

    async getUsers(queryOb: StaffQueryFilter): Promise<Staff[]> {
        const options = {};
        const { query, role } = queryOb;
        if (query) {
            options['$or'] = [];
            options['$or'].push({'firstName.en': {$regex: new RegExp(query), $options:"i"}});
            options['$or'].push({'lastName.en': {$regex: new RegExp(query), $options:"i"}});
            options['$or'].push({'firstName.am': {$regex: new RegExp(query), $options:"i"}});
            options['$or'].push({'lastName.am': {$regex: new RegExp(query), $options:"i"}});
            options['$or'].push({username: {$regex: new RegExp(query), $options:"i"}});
        }
        if (role) {
            options['role'] = role;
        }
        return this.staffModel.find(options);
    }

    async updateStaff(
        id: mongoose.Types.ObjectId,
        staff: IStaff,
        avatar: Express.Multer.File
    ): Promise<Staff | null> {
        const updated = this.staffModel.findByIdAndUpdate(id, staff);
        if (avatar) {
            const avatarUrl = await this.uploadService.uploadAvatar(avatar, staff.username, UserType.STAFF);
            const user = await this.staffModel.findById(id);
            if (!user) throw new NotFoundException();
            user.avatar = avatarUrl;
            return await user.save();
        }
        return updated;
    }

    async deleteUser(id: mongoose.Types.ObjectId): Promise<Staff | null> {
        const tmp = await this.staffModel.findById(id);
        if (!tmp) throw new NotFoundException();
        if (tmp.avatar) {
            const avatar = this.uploadService.getPublicId(tmp.avatar);
            this.uploadService.removeFile(avatar).then(console.log);
        }
        return await this.staffModel.findByIdAndDelete(id);
    }

    async getResetPasswordDto(id: string): Promise<ResetPassword | null> {
        const data = await this.resetPasswordModel.findOne({
            hashed_id: id,
            user_type: 'staff',
        });
        return data;
    }

    async resetPassword(
        id: mongoose.Types.ObjectId,
        password: string
    ): Promise<Staff> {
        const staff = await this.staffModel.findById(id);
        if (!staff)
            throw new NotFoundException();
        staff.password = password;
        await this.resetPasswordModel.findOneAndUpdate(
            { user_id: id, user_type: 'staff' },
            { is_used: true },
        );
        return staff.save();
    }

    async getCoaches(): Promise<IStaff[] | null> {
        return await this.staffModel.find({ role: StaffRole.COACH }).select('_id username');
    }
    
    async signIn(username: string, password: string): Promise<any> {
        const staff = await this.staffModel.findOne({username});
        if (!staff) throw new NotFoundException();
        if (!password || !staff.password || !(await bcrypt.compare(password, staff.password)))
            throw new UnauthorizedException();
        
        const {_id, firstName, lastName, email, role} = staff;
        return {
            access_token: await this.jwtService.signAsync({
                _id,
                firstName,
                lastName,
                email,
                role,
                username: staff.username
            })
        };
    }

    async getCountries(): Promise<Country[]> {
        return this.countryModel.find();
    }

    async addCountry(country: ICountry): Promise<Country | null> {
        const newCountry = new this.countryModel(country);
        return await newCountry.save();
    }

    async updateCountry(country: ICountry, id: string): Promise<Country | null> {
        return await this.countryModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), country);
    }

    async deleteCountry(id: string): Promise<Country | null> {
        return await this.countryModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    }
}