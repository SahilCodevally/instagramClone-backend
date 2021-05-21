import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { VALIDATION } from '../../constants';

export class CreateUserDto {
  @IsNotEmpty({ message: VALIDATION.fullName })
  readonly fullName: string;

  @IsNotEmpty({ message: VALIDATION.userName })
  readonly userName: string;

  @IsEmail(undefined, { message: VALIDATION.validEmail })
  @IsNotEmpty({ message: VALIDATION.email })
  readonly email: string;

  @MinLength(5, { message: VALIDATION.validPassword })
  @IsNotEmpty({ message: VALIDATION.password })
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty({ message: VALIDATION.userName })
  readonly userName: string;

  @MinLength(5, { message: VALIDATION.validPassword })
  @IsNotEmpty({ message: VALIDATION.password })
  readonly password: string;
}
