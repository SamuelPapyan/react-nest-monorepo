import { Types } from 'mongoose'

export class IComment {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    userType: string;
    date: Date;
    content: string;
}