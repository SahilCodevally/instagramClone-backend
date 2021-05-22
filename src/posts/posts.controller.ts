import {
  HttpException,
  Req,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CODE, MESSAGE, VALIDATION } from '../constants';
import { UsersService } from '../users/users.service';
import { fileFilter } from '../utils/file_helper';
import { PostsService } from './posts.service';
import { PostI } from './interfaces/post.interface';
// import { CreatePostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  // Create post
  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  @UseInterceptors(FilesInterceptor('images', 10, { fileFilter }))
  async createPost(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req,
  ): Promise<{ code: number; message: string }> {
    try {
      if (!images || images.length === 0) {
        throw new HttpException(VALIDATION.images, CODE.badRequest);
      }

      // Check for user
      const id = req.user._id;
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw {
          code: CODE.dataNotFound,
          message: MESSAGE.userNotFound,
        };
      }

      // Upload images to the cloud
      const result = await this.postsService.uploadFile(images);

      const postData = {
        images: [...result],
        author: id,
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

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllPosts(@Req() req): Promise<PostI[]> {
    try {
      // Check for user
      const id = req.user._id;
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw {
          code: CODE.dataNotFound,
          message: MESSAGE.userNotFound,
        };
      }

      // Get user's posts
      return await this.postsService.getAllPost(req.user._id);
    } catch (err) {
      console.log({ err });
      throw new HttpException(err.message, err.code);
    }
  }
}
