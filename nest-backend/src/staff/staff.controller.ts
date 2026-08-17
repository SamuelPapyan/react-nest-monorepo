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
    UseInterceptors 
} from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { StaffService } from "./staff.service";
import { StudentsService } from "src/students/students.service";
import { WorkshopService } from "src/workshops/workshop.service";
import { GroupChatService } from "src/group-chat/group-chat.service";
import { MailService } from 'src/mail/mail.service';
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { Roles } from "src/roles/roles.decorator";
import { StaffRole } from "src/enums/staff-role.enum";
import { IResponse } from "src/interfaces/response.interface";
import { messages } from "src/constants/message.constants";
import mongoose from "mongoose";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { IStaff } from "./staff.interface";
import { ICountry } from "src/country/country.interface";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { GetUser } from 'src/decorators/user.decorator'
import { IStudent } from "src/students/student.interface";
import { IGroupChat } from "src/group-chat/group-chat.interface";
import { IWorkshop } from 'src/workshops/workshop.interface'
import { UserType } from "src/enums/user-type.enum";
import { IAttendee } from 'src/workshops/attendee.interface'

@Controller('staff')
@UseFilters(AllExceptionFilter)
export class StaffController {
    constructor(
        private readonly studentService: StudentsService,
        private readonly workshopService: WorkshopService,
        private readonly staffService: StaffService,
        private readonly groupChatService: GroupChatService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
        private readonly mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get()
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER, StaffRole.COACH)
    async getStaff(@Query('q') query, @Query('role') role): Promise<IResponse | undefined> {
        const users = await this.staffService.getUsers({query, role});
        return this.responseManager.getResponse(users, messages.STAFF_GENERATED);
    }

    @Post()
    @Roles(StaffRole.ADMIN)
    @UseInterceptors(FileInterceptor('avatar'))
    async addStaff(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() userDto: IStaff
    ):Promise<IResponse | undefined> {
        try {
        const user = await this.staffService.addStaff(
            userDto,
            avatar
        );
        return this.responseManager.getResponse(user, 'USER_ADDED');
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('me')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER, StaffRole.COACH)
    getProfile(@GetUser() user): Promise<IResponse> {
        console.log("ROLE GUARD");
        console.log(user);
        return this.responseManager.getResponse(user, 'Profile got successful');
    }

    @Get('students')
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

    // @UseGuards(AuthGuard)
    @Get('students/coach')
    @Roles(StaffRole.COACH)
        async getCoachStudents(
            @GetUser() user
        ): Promise<IResponse | undefined> {
            try {
                const data = await this.studentService.getStudents({coachId: user._id});
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
    
    @Get('students/:id')
    @Roles(StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async getStudentById(@Param('id') id: string): Promise<IResponse | undefined> {
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

    @Post('students')
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

    @Put('students/:id')
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

    @Delete('students/:id')
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

    @Get('workshops')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async getWorkshops(
        @Query('q') query,
    ): Promise<IResponse> {
        const workshops = await this.workshopService.getWorkshops({query})
        return this.responseManager.getResponse(
            workshops,
            messages.WORKSHOPS_GENERATED_SUCCESSFULLY
        );
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

    
    @Get('workshops/:id')
    @Roles(StaffRole.EDITOR, StaffRole.ADMIN)
    async getWorkshopById(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.getById(mongoId);
            if (!workshop) {
                throw new NotFoundException();
            }
            return this.responseManager.getResponse(workshop, messages.WORKSHOP_NOT_FOUND);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('workshop/:id/details')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
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

    @Get('workshop/:id/attendance')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async loadAttendanceList(
        @Param('id') id
    ) {
        try {
            const workshopId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.loadAttendees(workshopId)
            if (!data) {
                throw new NotFoundException('WORKSHOP_ATTENDEES_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.WORKSHOP_ATTENDEES_GET,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post('workshops/announcements/:id/comments')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async leaveCommentInAnnouncement(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const announId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.leaveCommentInAnnouncement(
                new mongoose.Types.ObjectId(user._id),
                UserType.STAFF,
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
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async leaveCommentInAssignment(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const assignId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.leaveCommentInAssignment(
                new mongoose.Types.ObjectId(user._id),
                UserType.STAFF,
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
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async leavePrivateComment(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const assignId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.leavePrivateComment(
                new mongoose.Types.ObjectId(user._id),
                UserType.STAFF,
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

    @Post('workshops/:id/announcements')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
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
                UserType.STAFF,
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

    @Post('workshops/:id/assignments')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async createAssignment(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const workshopId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.createAssignment(
                workshopId,
                new mongoose.Types.ObjectId(user._id),
                body.content,
                body.deadline
            )
            if (!data) {
                throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ASSIGNMENT_POST,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post('workshops')
    @Roles(StaffRole.ADMIN)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async addWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: IWorkshop,
    ): Promise<IResponse | undefined> {
        try {
            const workshop = await this.workshopService.addWorkshop(
                workshopDto,
                cover_photo
            );
            return this.responseManager.getResponse(workshop, 'WORKSHOP ADDED SUCCESSFULLY');
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/announcements/:id')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async editAnnouncement(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const announId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.editAnnouncement(announId, body.content)
            if (!data) {
                throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ANNOUNCEMENT_PUT,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/assignments/work/:id/grade')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async gradeWork(
        @Param('id') id,
        @Body() body
    ) {
        try {
            const workId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.gradeWork(
                workId,
                body.score as number
            )
            if (!data) {
                throw new NotFoundException('ASSIGNMENT_WORK_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ASSIGNMENT_WORK_GRADE,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/assignments/:id')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async editAssignment(
        @Param('id') id,
        @Body() body,
        @GetUser() user
    ) {
        try {
            const assignId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.editAssignment(assignId, body.content, body.deadline)
            if (!data) {
                throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ASSIGNMENT_PUT,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshops/:id')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async updateWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: IWorkshop,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.updateWorkshop(
                mongoId,
                workshopDto,
                cover_photo
            );
            if (!workshop){
                throw new NotFoundException(messages.WORKSHOP_NOT_FOUND);
            }
            return this.responseManager.getResponse(
                workshop,
                messages.WORKSHOP_UPDATED_SUCCESSFULLY
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('workshop/:id/attendance')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
      async setAttendanceStatus(
        @Param('id') id,
        @Body() body: IAttendee
      ) {
        try {
          const workshopId = new mongoose.Types.ObjectId(id);
          const data = this.workshopService.setAttendanceStatus(
            workshopId, new mongoose.Types.ObjectId(body.user), body.date, body.status
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

    @Delete('workshops/announcements/:id')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async deleteAnnouncement(
        @Param('id') id
    ) {
        try {
            const announId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.deleteAnnouncement(announId)
            if (!data) {
                throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ANNOUNCEMENT_DELETE,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }
    
    @Delete('workshops/assignments/:id')
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN, StaffRole.COACH)
    async deleteAssignment(
        @Param('id') id
    ) {
        try {
            const assignId = new mongoose.Types.ObjectId(id);
            const data = this.workshopService.deleteAssignment(assignId)
            if (!data) {
                throw new NotFoundException('ANNOUNCEMENT_NOT_FOUND');
            }
            return this.responseManager.getResponse(
                data,
                messages.ASSIGNMENT_DELETE,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete('workshops/:id')
    @Roles(StaffRole.ADMIN)
    async deleteWorkshop(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.deleteWorkshop(mongoId);
            if (!workshop) {
                throw new NotFoundException(messages.WORKSHOP_NOT_FOUND)
            }
            return this.responseManager.getResponse(
                workshop,
                messages.WORKSHOP_DELETED_SUCCESSFULLY
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('group_chat/me')
    @Roles(StaffRole.COACH)
    async getGroupChatsByOwner(
        @GetUser() user
      ): Promise<IResponse | undefined> {
        try {
          const mongoId = new mongoose.Types.ObjectId(user._id);
          const groupChats = await this.groupChatService.getByOwnerId(mongoId);
          return this.responseManager.getResponse(
            groupChats,
            messages.GROUP_CHATS_GET,
          );
        } catch (e) {
          this.exceptionManager.throwException(e);
        }
      }

    @Get('group_chat/:id')
    @Roles(StaffRole.COACH)
    async getGroupChatById(
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const groupChat = await this.groupChatService.getById(mongoId);
            if (!groupChat) {
                throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
            }
            return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_GET);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post('group_chat')
    @Roles(StaffRole.COACH)
    async addGroupChat(@Body() dto: IGroupChat): Promise<IResponse | undefined> {
        try {
            const groupChat = await this.groupChatService.addGroupChat(dto);
            return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_ADDED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('group_chat/:id')
    @Roles(StaffRole.COACH)
    async updateGroupChat(
        @Body() dto: IGroupChat,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
        const mongoId = new mongoose.Types.ObjectId(id);
        const groupChat = await this.groupChatService.updateGroupChat(mongoId, dto);
        if (!groupChat) {
            throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
        }
        return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_UPDATED)
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }


    @Delete('group_chat/:id')
    @Roles(StaffRole.COACH)
    async deleteGroupChat(
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const groupChat = await this.groupChatService.deleteGroupChat(mongoId);
            if (!groupChat) {
                throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
            }
            return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_DELETED)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('reset/validate/:id')
    async validateResetLink(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const data = await this.staffService.getResetPasswordDto(id);
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

    @Post('reset')
    @UseFilters(AllExceptionFilter)
    async sendPasswordRecovery(
        @Body() body: Record<string, any>
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.mailService.sendPasswordRecovery(
                body.email,
                UserType.STAFF
            );
            return this.responseManager.getResponse(
                data,
                'EMAIL_SENT'
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
            const user = await this.staffService.resetPassword(
                mongoId,
                body.password,
            );
            return this.responseManager.getResponse(user, messages.PASSWORD_RESET);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('coaches')
    @Roles(StaffRole.ADMIN)
    async getCoaches(): Promise<IResponse | any> {
        const coaches = await this.staffService.getCoaches();
        return this.responseManager.getResponse(
        coaches,
        messages.COACHES_GENERATED,
        );
    }

    @Post('login')
    async login(
        @Body() signInDto: Record<string, any>
    ): Promise<IResponse | undefined> {
        try {
            console.log("STAFF LOGIN!!", signInDto)
            const payload = await this.staffService.signIn(
                signInDto.username,
                signInDto.password,
            );
            return this.responseManager.getResponse(
                payload.access_token,
                'Log In Successful',
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('countries')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER)
    async getCountries() {
        try {
            const data = await this.staffService.getCountries();
            return this.responseManager.getResponse(data, messages.COUNTRIES_GET)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post('countries')
    @Roles(StaffRole.ADMIN)
    async addCountry(@Body() country: ICountry) {
        try {
            const data = await this.staffService.addCountry(country);
            return this.responseManager.getResponse(data, messages.COUNTRY_ADDED)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('countries/:id')
    @Roles(StaffRole.ADMIN)
    async updateCountry(@Param() id: string, @Body() country: ICountry) {
        try {
            const data = await this.staffService.updateCountry(country, id);
            return this.responseManager.getResponse(data, messages.COUNTRY_UPDATED)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete('countries/:id')
    @Roles(StaffRole.ADMIN)
    async deleteCountry(@Param() id: string) {
        try {
            const data = await this.staffService.deleteCountry(id);
            return this.responseManager.getResponse(data, messages.COUNTRY_DELETED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get(':id')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER)
    async getById(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
        const mongoId = new mongoose.Types.ObjectId(id);
        const user = await this.staffService.getById(mongoId);
        if (!user) {
            throw new NotFoundException(messages.STAFF_NOT_FOUND);
        }
        return this.responseManager.getResponse(user, messages.STAFF_GET);
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }

        @Put(':id')
    @UseInterceptors(FileInterceptor('avatar'))
    @Roles(StaffRole.ADMIN)
    async updateStaff(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() userDto: IStaff,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
        const mongoId = new mongoose.Types.ObjectId(id);
        const user = await this.staffService.updateStaff(
            mongoId,
            userDto,
            avatar
        );
        if (!user) {
            throw new NotFoundException(messages.STAFF_NOT_FOUND);
        }
        return this.responseManager.getResponse(user, messages.STAFF_UPDATED);
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }

    @Delete(':id')
    @Roles(StaffRole.ADMIN)
    async deleteUser(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const user = await this.staffService.deleteUser(mongoId);
            if (!user) {
                throw new NotFoundException(messages.STAFF_NOT_FOUND);
            }
            return this.responseManager.getResponse(user, messages.STAFF_DELETED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }
}