import { Types } from 'mongoose'

export interface IAssignmentUpload {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    files: string[];
    score: number;
}

export class IAssignment {
    _id?: Types.ObjectId;
    workshop: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    comments: Types.ObjectId[];
    publicComments: Types.ObjectId[];
    uploads: IAssignmentUpload[];
    date: Date;
    deadline: Date | null;
}