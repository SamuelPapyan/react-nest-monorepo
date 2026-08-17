import { Types } from 'mongoose'
import { AttendanceStatus } from './attendance-status.enum'

export class IAttendee {
    _id: Types.ObjectId;
    workshop: Types.ObjectId;
    user: Types.ObjectId;
    date: Date;
    status: AttendanceStatus;
}