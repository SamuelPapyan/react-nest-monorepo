import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  Query,
  Inject,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from 'src/students/student.service';
import { StudentDTO } from 'src/students/student.dto';
import { Student } from 'src/students/student.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { AllExceptionFilter } from 'src/app/all-exception.filter';
import { messages } from 'src/app/config';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { ResetPassword } from 'src/mail/reset_password.schema';
import { MailService } from 'src/mail/mail.service';
import { WorkshopService } from 'src/workshop/workshop.service';
import { Workshop } from 'src/workshop/workshop.schema';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { GroupChatService } from 'src/group_chat/group_chat.service';
import { GroupChat } from 'src/group_chat/group_chat.schema';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('students')
@UseFilters(AllExceptionFilter)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly responseManager: ResponseManager<Student>,
    private readonly exceptionManager: ExceptionManager,
    private readonly workshopService: WorkshopService,
    private readonly groupChatService: GroupChatService,
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get()
  @Roles(Role.Viewer, Role.Editor, Role.Admin)
  async getStudents(
    @Query('q') query,
    @Query('best') best,
    @Query('count') count,
  ): Promise<ResponseDTO<Student[]>> {
    const students = await this.studentService.getStudents({
      query,
      best,
      count,
    });
    return new ResponseManager<Student[]>().getResponse(
      students,
      messages.STUDENT_GENERATED,
    );
  }

  @Get('workshops')
  @UseFilters(AllExceptionFilter)
  async getWorkshops(
    @Query('q') query,
    @Query('studentName') username,
  ): Promise<ResponseDTO<Workshop[]>> {
    try {
      const data = await this.workshopService.getWorkshops(query, username);
      return new ResponseManager<Workshop[]>().getResponse(
        data,
        'WORKSHOPS_GET_SUCCESSFUL',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('group_chats/:studentId')
  @UseFilters(AllExceptionFilter)
  async getGroupChats(
    @Param('studentId') studentId: string
  ): Promise<ResponseDTO<GroupChat[]>> {
    try {
      const data = await this.groupChatService.getGroupChatstByStudent(
        studentId
      );
      return new ResponseManager<GroupChat[]>().getResponse(
        data,
        'GROUP_CHATS_GOT_SUCCESSFULLY',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('coach/:coach')
  @UseFilters(AllExceptionFilter)
  async getStudentsByCoach(
    @Param('coach') coach: string,
  ): Promise<ResponseDTO<any>> {
    try {
      const data = await this.studentService.getStudentsByCoach(coach);
      if (!(await this.cacheManager.get('handUps')))
        await this.cacheManager.set('handUps', {});
      const handUps = await this.cacheManager.get('handUps');
      const responseData = data.map((value) => {
        return {
          ...value,
          handUp: handUps[value.username] ? true : false,
        }
      })
      return new ResponseManager<any>().getResponse(
        responseData,
        'COACH_STUDENTS_GET_SUCCESSFULLY',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('username/:username')
  @UseFilters(AllExceptionFilter)
  async getStudentByUsername(
    @Param('username') username: string,
  ): Promise<ResponseDTO<any>> {
    try {
      const data = await this.studentService.getStudentByUsername(username);
      if (!data) throw new NotFoundException('Student Not Found');
      if (!(await this.cacheManager.get('handUps')))
        await this.cacheManager.set('handUps', {});
      const handUps = await this.cacheManager.get('handUps');
      return new ResponseManager<any>().getResponse(
        {
          username: data.username,
          coach: data.coach,
          handUp: handUps[data.username] ? true : false
        },
        'STUDENT_GET_SUCCESSFULLY',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get(':id')
  @Roles(Role.Editor, Role.Admin)
  async getById(@Param('id') id: string): Promise<ResponseDTO<Student>> {
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
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('avatar'))
  async addStudent(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() studentDto,
  ): Promise<ResponseDTO<Student>> {
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
  ): Promise<ResponseDTO<Workshop>> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.registerStudedntToWorkshop(
        workshopId,
        body.username,
      );
      if (!workshop) {
        throw new NotFoundException('WORKSHOP_NOT_FOUND');
      }
      return new ResponseManager<Workshop>().getResponse(
        workshop,
        'STUDENT REGISTERED TO WORKSHOP SUCCESSFULLY',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(Role.Admin, Role.Editor)
  async updateStudent(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() studentDto: StudentDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<Student>> {
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
  ) : Promise<ResponseDTO<Workshop>> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.unregisterStudedntToWorkshop(
        workshopId,
        body.username,
      );
      if (!workshop) {
        throw new NotFoundException('WORKSHOP_NOT_FOUND');
      }
      return new ResponseManager<Workshop>().getResponse(
        workshop,
        'STUDENT REGISTERED TO WORKSHOP SUCCESSFULLY',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteStudent(@Param('id') id: string): Promise<ResponseDTO<Student>> {
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
  ): Promise<ResponseDTO<any>> {
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
  @UseFilters(AllExceptionFilter)
  async sendPasswordRecovery(
    @Body() body: Record<string, any>,
  ): Promise<ResponseDTO<ResetPassword>> {
    try {
      const data = await this.mailService.sendPasswordRecovery(
        body.email,
        'student',
      );
      return new ResponseManager<ResetPassword>().getResponse(
        data,
        'EMAIL_SENT',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('reset/validate/:id')
  @UseFilters(AllExceptionFilter)
  async validateResetLink(@Param('id') id: string): Promise<ResponseDTO<any>> {
    try {
      const data = await this.studentService.getResetPasswordDto(id);
      let bool = true;
      if (!data || data.is_used || data.expiration_date < Date.now())
        bool = false;
      return new ResponseManager<any>().getResponse(
        { user_id: data.user_id, isValid: bool },
        'VALIDATION',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put('reset/:id')
  @UseFilters(AllExceptionFilter)
  async resetPassword(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ): Promise<ResponseDTO<StudentDTO>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.studentService.resetPassword(
        mongoId,
        body.password,
      );
      return this.responseManager.getResponse(user, 'PASSWORD_RESET');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}
