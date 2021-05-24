import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { config } from '../../config';
import { CODE, MESSAGE } from '../../constants';
import * as mongoose from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findUserById(payload._id);
      if (!user) {
        throw {
          code: CODE.dataNotFound,
          message: MESSAGE.userNotFound,
        };
      }

      return { ...user };
    } catch (err) {
      new HttpException(err.message, err.code);
    }
  }
}
