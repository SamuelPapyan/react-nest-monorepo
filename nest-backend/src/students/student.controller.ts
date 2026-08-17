import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { StudentsService } from "./students.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { WorkshopService } from "src/workshops/workshop.service";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { GroupChatService } from "src/group-chat/group-chat.service";
import { MailService } from "src/mail/mail.service";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { IAttendee } from 'src/workshops/attendee.interface'
import { IResponse } from "src/interfaces/response.interface";
import { messages } from "src/constants/message.constants";
import mongoose from "mongoose";
import { UserType } from "src/enums/user-type.enum";
import { StudentGuard } from 'src/guards/student.guard'
import { GetUser } from 'src/decorators/user.decorator'
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('students')
@UseFilters(AllExceptionFilter)
export class StudentController {
    constructor (
        private readonly studentService: StudentsService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
        private readonly workshopService: WorkshopService,
        private readonly portfolioService: PortfolioService,
        private readonly groupChatService: GroupChatService,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get('workshops')
    async getWorkshops(
        @Query('q') query
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.workshopService.getWorkshops({query})
            return this.responseManager.getResponse(
                data,
                messages.WORKSHOPS_GET_SUCCESSFUL
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('workshops/me')
    @UseGuards(StudentGuard)
    async getMyWorkshops(
        @GetUser() user
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.workshopService.getWorkshops({student: user.username})
            return this.responseManager.getResponse(
                data,
                messages.WORKSHOPS_GET_SUCCESSFUL
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('group_chats/me')
    @UseGuards(StudentGuard)
    async getGroupChats(
      @GetUser() user
    ) : Promise<IResponse | undefined> {
        try {
            const data = await this.groupChatService.getGroupChatstByStudent(
                user._id
            );
            return this.responseManager.getResponse(
                data,
                messages.GROUP_CHATS_GOT_SUCCESSFULLY,
        );
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }

    @Get('me')
    @UseGuards(StudentGuard)
    getProfile(@GetUser() user): Promise<IResponse> {
        return this.responseManager.getResponse(user, 'Profile got successful');
    }

    @Get('me/data')
    @UseGuards(StudentGuard)
    async getUserData(
        @GetUser() user
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.studentService.getById(user._id)
            if (!data) throw new NotFoundException('Student Not Found');
            if (!(await this.cacheManager.get('handUps')))
                await this.cacheManager.set('handUps', {});
            const handUps = await this.cacheManager.get('handUps') as object;
            return this.responseManager.getResponse(
                {
                username: data.username,
                coach: data.coach,
                handUp: handUps[data._id.toString()] ? true : false
                },
                messages.STUDENT_GET,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/:id')
    @UseGuards(StudentGuard)
    async registerToWorkshop(
        @GetUser() user,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.registerStudentToWorkshop(
        workshopId,
        new mongoose.Types.ObjectId(user._id),
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

  @Get('workshop/:id/details')
  async loadWorkshopDashboard(
    @Param('id') id
  ) {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshopDetail = this.workshopService.loadWorkshopDashboard(workshopId)
      if (!workshopDetail) {
        throw new NotFoundException('WORKSHOP_DETAILS_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        workshopDetail,
        messages.WORKSHOP_DETAILS_GET,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put('workshop/:id/attendance')
  @UseGuards(StudentGuard)
  async setAttendanceStatus(
    @Param('id') id,
    @Body() body: IAttendee,
    @GetUser() user
  ) {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.setAttendanceStatus(
        workshopId, new mongoose.Types.ObjectId(user._id), body.date, body.status
      )
      if (!data) {
        throw new NotFoundException('ATTENDANCE_STATUS_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ATTENDEE_PUT,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('workshops/announcements/:id')
  async loadAnnouncement(
    @Param('id') id
  ) {
    try {
      const announId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.loadAnnouncement(announId);
      if (!data) {
        throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ANNOUNCEMENT_GET,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('workshops/:id/announcements')
  @UseGuards(StudentGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async createAnnouncement(
    @Param('id') id,
    @Body() body,
    @GetUser() user,
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.createAnnouncement(
        workshopId,
        new mongoose.Types.ObjectId(user._id),
        UserType.STUDENT,
        body.content,
        files
      )
      if (!data) {
        throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ANNOUNCEMENT_POST,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('/workshops/assignments/me')
  @UseGuards(StudentGuard)
  async loadOngoingAssignments(
    @GetUser() user
  ) {
    try {
      const userId = new mongoose.Types.ObjectId(user._id);
      const data = await this.workshopService.loadOngoingAssignments(userId);
      if (!data) {
        throw new NotFoundException('ASSIGNMENTS_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ONGOING_ASSIGNMENT_GET,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
  
  @Get('workshops/assignments/:id')
  async loadAssignment(
    @Param('id') id
  ) {
    try {
      const assignId = new mongoose.Types.ObjectId(id);
      const data = await this.workshopService.loadAssignment(assignId);
      if (!data) {
        throw new NotFoundException('ASSIGNMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ASSIGNMENT_GET,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('workshops/assignments/:id')
  @UseGuards(StudentGuard)
  @UseInterceptors(FilesInterceptor('avatar', 10))
  async uploadAssignmentWork(
    @Param('id') id,
    @GetUser() user,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      const assignId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.uploadAssignment(
        new mongoose.Types.ObjectId(user._id),
        assignId,
        files
      );
      if (!data) {
        throw new NotFoundException('ASSIGNMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ASSIGNMENT_UPLOAD,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('workshops/announcements/:id/comments')
  @UseGuards(StudentGuard)
  async leaveCommentInAnnouncement(
    @Param('id') id,
    @Body() body,
    @GetUser() user
  ) {
    try {
      const announId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.leaveCommentInAnnouncement(
        new mongoose.Types.ObjectId(user._id),
        UserType.STUDENT,
        announId,
        body.content
      )
      if (!data) {
        throw new NotFoundException('ANNOUNCEMNT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ANNOUNCEMENT_COMMENT_POST,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
  
  @Post('workshops/assignments/:id/comments')
  @UseGuards(StudentGuard)
  async leaveCommentInAssignment(
    @Param('id') id,
    @Body() body,
    @GetUser() user
  ) {
    try {
      const assignId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.leaveCommentInAssignment(
        new mongoose.Types.ObjectId(user._id),
        UserType.STUDENT,
        assignId,
        body.content
      )
      if (!data) {
        throw new NotFoundException('ASSIGNMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.ASSIGNMENT_COMMENT_POST,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('workshops/announcements/:id/private_comments')
  @UseGuards(StudentGuard)
  async leavePrivateComment(
    @Param('id') id,
    @Body() body,
    @GetUser() user
  ) {
    try {
      const assignId = new mongoose.Types.ObjectId(id);
      const data = this.workshopService.leavePrivateComment(
        new mongoose.Types.ObjectId(user._id),
        UserType.STUDENT,
        assignId,
        body.content
      )
      if (!data) {
        throw new NotFoundException('ASSIGNMENT_NOT_FOUND');
      }
      return this.responseManager.getResponse(
        data,
        messages.PRIVATE_COMMENT_POST,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }



  @Delete('workshops/:id')
  @UseGuards(StudentGuard)
  async unregisterFromWorkshop(
    @GetUser() user,
    @Param('id') id: string,
  ) : Promise<IResponse | undefined> {
    try {
      const workshopId = new mongoose.Types.ObjectId(id);
      const workshop = await this.workshopService.unregisterStudedntToWorkshop(
        workshopId,
        new mongoose.Types.ObjectId(user._id),
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

  @Post('login')
  async studentLogin(
    @Body() body: Record<string, any>,
  ): Promise<IResponse | undefined> {
    console.log("STUDENT LOGIN")
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

  @Post('reset')
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

  @Get('portfolio')
  @UseGuards(StudentGuard)
  async getPortfolio(
    @GetUser() user
  ) {
    try {
      const data = await this.portfolioService.getItems({
        student: user.username
      });
      return this.responseManager.getResponse(data, messages.PORTFOLIO_GET);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
    return this.responseManager.getResponse(["BAKA", "BAKA", "BAKA"], messages.PORTFOLIO_GET);
  }
}