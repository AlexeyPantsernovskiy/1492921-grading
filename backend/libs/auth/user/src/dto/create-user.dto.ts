import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { UserProperty } from '../user-module/user.constant';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @ApiProperty(UserProperty.Name.Description)
  @IsString()
  @Length(
    UserProperty.Name.Validate.MinLength,
    UserProperty.Name.Validate.MaxLength,
    {
      message: UserProperty.Name.Validate.Message,
    }
  )
  public name: string;
}
