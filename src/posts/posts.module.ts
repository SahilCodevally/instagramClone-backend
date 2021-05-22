import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './Schema/post.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
