import { Types } from 'mongoose'

export class IComment {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    date: Date;
    content: string;
}