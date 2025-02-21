import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserProperty } from '../user-module/user.constant';

export class TokenPayloadRdo {
  @ApiProperty(UserProperty.Id.Description)
  @Expose()
  public sub: string;

  @ApiProperty(UserProperty.Email.Description)
  @Expose()
  public email: string;

  @ApiProperty(UserProperty.Name.Description)
  @Expose()
  public name: string;
}
