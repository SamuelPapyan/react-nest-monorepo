import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffController } from 'src/staff/staff.controller';
import { StaffService } from 'src/staff/staff.service';
import { Staff, StaffSchema } from 'src/staff/staff.schema';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  controllers: [StaffController],
  providers: [StaffService, ResponseManager, ExceptionManager],
})
export class StaffModule {}
