import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CODE, MESSAGE, VALIDATION } from '../constants';
import { encryptPassword, verifyPassword } from '../utils/encryption';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // Signup
  @Post('signup')
  async signUp(
    @Body()
    userData: CreateUserDto,
  ): Promise<User> {
    try {
      // Get user detail by email
      const emailQuery = { email: userData.email };
      const userByEmail = await this.usersService.getUserDetails(emailQuery);
      if (userByEmail) {
        throw {
          code: CODE.badRequest,
          message: `${VALIDATION.emailTaken} ${userData.email}`,
        };
      }

      // Get user detail by user name
      const nameQuery = { userName: userData.userName };
      const userByName = await this.usersService.getUserDetails(nameQuery);
      if (userByName) {
        throw {
          code: CODE.badRequest,
          message: VALIDATION.userNameTaken,
        };
      }

      // Encrypt password
      const hashPassword = await encryptPassword(userData.password);
      userData.password = hashPassword;

      // Create user function
      return await this.usersService.createUser(userData);
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  // Login
  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
  ): Promise<User & { token: string }> {
    try {
      const { userName } = loginData;
      const emailRegex = /\b[a-z0-9-_.]+@[a-z0-9-_.]+(\.[a-z0-9]+)+/i;
      let query: { email?: string; userName?: string } = { userName };

      if (emailRegex.test(userName)) {
        query = { email: userName };
      }

      // Find user
      const user = await this.usersService.getUserDetails(query);
      if (!user) {
        throw {
          code: CODE.dataNotFound,
          message: MESSAGE.userNotFound,
        };
      }

      // Compare password if user found
      const isMatched = await verifyPassword(loginData.password, user.password);
      if (!isMatched) {
        throw {
          code: CODE.badRequest,
          message: MESSAGE.loginError,
        };
      }

      // generate token if user password matched
      const token = this.authService.generateToken(user._id);

      delete user.__v;
      delete user.password;

      // return user;
      return {
        ...user,
        token,
      };
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Req() req): Promise<User[]> {
    try {
      const id = req.user._id;

      // Find user
      const user = await this.usersService.findUserById(id);
      if (!user) {
        throw {
          code: CODE.dataNotFound,
          message: MESSAGE.userNotFound,
        };
      }

      return this.usersService.getAll();
    } catch (err) {
      throw new HttpException(err.message, err.code);
    }
  }
}
