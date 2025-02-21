import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

import { UserProperty } from '../user-module/user.constant';
export class LoginUserDto {
  @ApiProperty(UserProperty.Email.Description)
  @IsString()
  @IsEmail({}, { message: UserProperty.Email.Validate.Message })
  public email: string;

  @ApiProperty(UserProperty.Password.Description)
  @IsString()
  @Length(
    UserProperty.Password.Validate.MinLength,
    UserProperty.Password.Validate.MaxLength,
    {
      message: UserProperty.Password.Validate.Message,
    }
  )
  public password: string;
}
