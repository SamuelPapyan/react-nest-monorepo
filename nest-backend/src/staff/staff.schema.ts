import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { StaffRole } from "src/enums/staff-role.enum";
import * as bcrypt from 'bcrypt';

export type StaffDocument = HydratedDocument<Staff>

@Schema()
export class Staff {
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    firstName: Record<string, any>;
    
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    lastName: Record<string, any>;

    @Prop({ required: true, type: String, unique: true})
    username: string;

    @Prop({ required: true, type: String, unique: true })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String, default: StaffRole.VIEWER})
    role: StaffRole;

    @Prop({type: String, default: null})
    avatar: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(
            this.password,
            10,
        );
    next();
})

StaffSchema.pre('findOneAndUpdate', async function (next) {
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