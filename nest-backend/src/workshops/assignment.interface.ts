import { Types } from 'mongoose'

interface IAssignmentUpload {
    user: Types.ObjectId;
    files: string[];
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