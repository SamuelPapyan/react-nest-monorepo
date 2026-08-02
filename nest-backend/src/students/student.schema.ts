import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Country } from "src/country/country.schema";
import { Staff } from "src/staff/staff.schema";
import * as bcrypt from 'bcrypt';

export type StudentDocument = HydratedDocument<Student>

@Schema()
export class Student {
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    fullName: Record<string, any>;

    @Prop({ required: true, type: Date})
    birthDate: Date

    @Prop({ required: true, type: String, unique: true})
    username: string;

    @Prop({ required: true, type: String, unique: true })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({type: Number, default: 0})
    level: number;

    @Prop({type: Number, default: 0})
    experience: number;

    @Prop({type: Number, default: 100})
    max_experience: number;

    @Prop({type: String, default: null})
    avatar: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Staff.name,
        required: true
    })
    coach: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: Country.name,
        required: true
    })
    country: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', async function(next){
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(
            this.password,
            10
        )
    }
    if (this.isModified('coach') && typeof this.coach === 'string') {
        const StaffModel = this.db.model(Staff.name);
        const coachId = new Types.ObjectId(this.coach);
        const coach = await StaffModel.findById(coachId);
        if (!coach) {
            return next(new Error('Coach not found'));
        }
        this.coach = coach._id;
    }
    next();
})

StudentSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update && 'password' in update && typeof update.password === 'string') {
        try {
            update.password = await bcrypt.hash(update.password, 10);
        } catch (err) {
            return next(err);
        }
    }
    next();
})