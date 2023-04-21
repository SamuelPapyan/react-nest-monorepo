import { Module } from '@nestjs/common';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { StudentsModule } from 'src/modules/student.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    StudentsModule,
    MongooseModule.forRoot(
      'mongodb+srv://samvelpapyan1:tumo1234@cluster0.261k0xm.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
