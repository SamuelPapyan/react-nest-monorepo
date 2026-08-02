import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Query, UploadedFile, UseFilters, UseInterceptors } from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { StudentsService } from "./students.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { WorkshopService } from "src/workshops/workshop.service";
import { GroupChatService } from "src/group-chat/group-chat.service";
import { MailService } from "src/mail/mail.service";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Roles } from "src/roles/roles.decorator";
import { StaffRole } from "src/enums/staff-role.enum";
import { IResponse } from "src/interfaces/response.interface";
import { messages } from "src/constants/message.constants";
import mongoose from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { IStudent } from "./student.interface";
import { UserType } from "src/enums/user-type.enum";

@Controller('students')
@UseFilters(AllExceptionFilter)
export class StudentController {
    constructor (
        private readonly studentService: StudentsService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
        private readonly workshopService: WorkshopService,
        private readonly groupChatService: GroupChatService,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get()
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async getStudents(
        @Query('q') query,
        @Query('best') best,
        @Query('count') count,
        @Query('coach') coachId
    ): Promise<IResponse | null> {
        const students = await this.studentService.getStudents({
            query,
            best,
            count,
            coachId
        });
        return this.responseManager.getResponse(
            students,
            messages.STUDENT_GENERATED
        )
    }

    @Get('workshops')
    async getWorkshops(
        @Query('q') query,
        @Query('studentName') username,
        @Query('coach') coach
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.workshopService.getWorkshops({query, student: username})
            return this.responseManager.getResponse(
                data,
                messages.WORKSHOPS_GET_SUCCESSFUL
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('group_chats/:studentId')
    async getGroupChats(
        @Param('studentId') studentId: string
    ) : Promise<IResponse | undefined> {
        try {
            const data = await this.groupChatService.getGroupChatstByStudent(
                studentId
            );
            return this.responseManager.getResponse(
                data,
                messages.GROUP_CHATS_GOT_SUCCESSFULLY,
        );
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }
    
    @Get('coach/:coach')
    async getStudentsByCoach(
        @Param('coach') coachId
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.studentService.getStudents({coachId});
            if (!(await this.cacheManager.get('handUps')))
                await this.cacheManager.set('handUps', {})
            const handUps = await this.cacheManager.get('handUps') as object;
            const responseData = data.map((value)=> {
                return {
                    ...(value ? value : {}),
                    handUps: value ? (handUps[value.username] ? true : false) : false,
                }
            })
            return this.responseManager.getResponse(
                responseData,
                messages.COACH_STUDENTS_GET_SUCCESSFULLY
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('username/:username')
    async getStundentByUsername(
        @Param('username') username: string
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.studentService.getOne(username);
            if (!data) throw new NotFoundException('Student Not Found');
            if (!(await this.cacheManager.get('handUps')))
                await this.cacheManager.set('handUps', {});
            const handUps = await this.cacheManager.get('handUps') as object;
            return this.responseManager.getResponse(
                {
                username: data.username,
                coach: data.coach,
                handUp: handUps[data.username] ? true : false
                },
                messages.STUDENT_GET,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get(':id')
    @Roles(StaffRole.EDITOR, StaffRole.ADMIN)
    async getById(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const student = await this.studentService.getById(mongoId);
            if (!student) {
                throw new NotFoundException(messages.STUDENT_NOT_FOUND);
            }
            return this.responseManager.getResponse(student, messages.STUDENT_GET);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post()
    @Roles(StaffRole.ADMIN)
    @UseInterceptors(FileInterceptor('avatar'))
    async addStudent(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() studentDto,
    ): Promise<IResponse | undefined> {
        try {
            const student = await this.studentService.addStudent(
                studentDto,
                avatar,
            );
            return this.responseManager.getResponse(student, messages.STUDENT_ADDED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/:id')
    async registerToWorkshop(
        @Body() body: Record<string, string>,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.registerStudentToWorkshop(
        workshopId,
        new mongoose.Types.ObjectId(body.studentId),
      );
      if (!workshop) {
        throw new NotFoundException('WORKSHOP_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        workshop,
        messages.STUDENT_REGISTERED_TO_WORKSHOP_SUCCESSFULLY,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(StaffRole.ADMIN, StaffRole.EDITOR)
  async updateStudent(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() studentDto: IStudent,
    @Param('id') id: string,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const student = await this.studentService.updateStudent(
        mongoId,
        studentDto,
        avatar
      );
      if (!student) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(
        student,
        messages.STUDENT_UPDATED,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete('workshops/:id')
  async unregisterFromWorkshop(
    @Param('id') id: string,
    @Body() body: Record<string, string>
  ) : Promise<IResponse | undefined> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.unregisterStudedntToWorkshop(
        workshopId,
        new mongoose.Types.ObjectId(body.studentId),
      );
      if (!workshop) {
        throw new NotFoundException('WORKSHOP_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        workshop,
        messages.STUDENT_UNREGISTERED_FROM_WORKSHOP_SUCCESSFULLY,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(StaffRole.ADMIN)
  async deleteStudent(@Param('id') id: string): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const student = await this.studentService.deleteStudent(mongoId);
      if (!student) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(
        student,
        messages.STUDENT_DELETED,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('login')
  async studentLogin(
    @Body() body: Record<string, any>,
  ): Promise<IResponse | undefined> {
    try {
      const payload = await this.studentService.signIn(
        body.username,
        body.password,
      );
      return this.responseManager.getResponse(
        payload.access_token,
        'Log In Successful',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('send_mail')
  async sendPasswordRecovery(
    @Body() body: Record<string, any>,
  ): Promise<IResponse | undefined> {
    try {
      const data = await this.mailService.sendPasswordRecovery(
        body.email,
        UserType.STUDENT,
      );
      return this.responseManager.getResponse(
        data,
        messages.EMAIL_SENT,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('reset/validate/:id')
  async validateResetLink(@Param('id') id: string): Promise<IResponse | undefined> {
    try {
      const data = await this.studentService.getResetPasswordDto(id);
      let bool = true;
      if (!data || data.is_used || data.expiration_date < Date.now())
        bool = false;
      return  this.responseManager.getResponse(
        { user_id: data?.user_id, isValid: bool },
        messages.LINK_VALIDATION,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put('reset/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.studentService.resetPassword(
        mongoId,
        body.password,
      );
      return this.responseManager.getResponse(user, messages.PASSWORD_RESET);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}