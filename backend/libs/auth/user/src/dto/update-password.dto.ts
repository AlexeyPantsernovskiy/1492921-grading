import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserProperty } from '../user-module/user.constant';

export class UpdatePasswordDto {
  @ApiProperty(UserProperty.OldPassword.Description)
  @IsString()
  public oldPassword: string;

  @ApiProperty(UserProperty.NewPassword.Description)
  @IsString()
  @Length(
    UserProperty.NewPassword.Validate.MinLength,
    UserProperty.NewPassword.Validate.MaxLength,
    {
      message: UserProperty.NewPassword.Validate.Message,
    }
  )
  public newPassword: string;
}
