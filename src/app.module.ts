import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(config.mongoUri, { useFindAndModify: false }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
