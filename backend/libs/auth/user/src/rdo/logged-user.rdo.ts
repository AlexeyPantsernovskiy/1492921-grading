import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserProperty } from '../user-module/user.constant';

export class LoggedUserRdo {
  @ApiProperty(UserProperty.Id.Description)
  @Expose()
  public id: string;

  @ApiProperty(UserProperty.Email.Description)
  @Expose()
  public email: string;

  @ApiProperty(UserProperty.AccessToken.Description)
  @Expose()
  public accessToken: string;

  @ApiProperty(UserProperty.RefreshToken.Description)
  @Expose()
  public refreshToken: string;
}
