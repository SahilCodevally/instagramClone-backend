import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';
import { CODE, MESSAGE, emailRegex, VALIDATION } from 'src/constants';
import { encryptPassword, verifyPassword } from 'src/utils/encryption';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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
}
