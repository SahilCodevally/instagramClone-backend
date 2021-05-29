import {
  HttpException,
  Req,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CODE, MESSAGE, VALIDATION } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { fileFilter } from 'src/utils/file_helper';
import { PostsService } from './posts.service';
import * as mongoose from 'mongoose';
import { PostI } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  // Create post
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { fileFilter }))
  async createPost(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req,
  ): Promise<{ code: number; message: string }> {
    try {
      if (!images || images.length === 0) {
        throw new HttpException(VALIDATION.images, CODE.badRequest);
      }

      // Upload images to the cloud
      const result = await this.postsService.uploadFile(images);

      const postData = {
        images: [...result],
        author: req.user._id,
        detail: req.body.detail,
      };

      // Save uploaded images url and key to database
      const post = await this.postsService.createPost(postData);
      if (!post) {
        throw {
          code: CODE.internalServer,
          message: MESSAGE.createPostFailed,
        };
      }

      return {
        code: CODE.created,
        message: MESSAGE.postCreated,
      };
    } catch (err) {
      console.log({ err });
      throw new HttpException(err.message, err.code);
    }
  }

  // Get user and hif following user's all posts
  @UseGuards(JwtAuthGuard)
  @Get()
  async posts(@Req() req): Promise<PostI[]> {
    try {
      // Get user's all following
      const users = [...req.user.following, req.user._id];

      // Get user's posts
      return await this.postsService.posts(users, req.user._id);
    } catch (err) {
      console.log({ err });
      throw new HttpException(err.message, err.code);
    }
  }

  // Get post
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async post(@Req() req, @Param('id') id: string): Promise<PostI> {
    const postId = mongoose.Types.ObjectId(id);
    try {
      // Get user's posts
      const posts = await this.postsService.post(postId, req.user._id);
      return posts[0];
    } catch (err) {
      console.log({ err });
      throw new HttpException(err.message, err.code);
    }
  }

  // Delete post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Req() req, @Param('id') id: string): Promise<PostI> {
    try {
      // Delete post from database
      const post = await this.postsService.deletePost(req.user._id, id);

      // Remove images of post from cloud
      this.postsService.deletePostImages(post?.images);

      return post;
    } catch (err) {
      console.log({ err });
      throw new HttpException(err.message, err.code);
    }
  }
}
