import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(config.mongoUri, { useFindAndModify: false }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
