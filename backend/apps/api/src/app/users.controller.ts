import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  UserParam,
  UserResponse,
  LoginUserDto,
  UpdatePasswordDto,
  UserOperation,
  UserRdo,
  CreateUserDto,
} from '@project/user';

import { ApplicationServiceURL, ClientConfig } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckNoAuthGuard } from './guards/check-no-auth.guard.';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { EmailService } from '@project/notify-email';
import { CommonResponse, LogonInfo } from '@project/shared-core';

@ApiTags('Users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    private readonly emailService: EmailService
  ) {}

  @Post('register')
  @ApiOperation(UserOperation.Register)
  @ApiResponse(UserResponse.UserCreated)
  @ApiResponse(UserResponse.UserExist)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiResponse(UserResponse.UserAuthForbidden)
  @UseGuards(CheckNoAuthGuard)
  public async create(@Body() dto: CreateUserDto) {
    const user = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/register`,
      dto
    );
    const { email, name } = dto;
    const logonInfo: LogonInfo = {
      applicationName: ClientConfig.Name,
      url: ClientConfig.Url,
      login: email,
      password: dto.password,
    };
    this.emailService.sendNotifyUserRegister({ email, name }, logonInfo);
    return user.data;
  }

  @Post('change-password')
  @ApiOperation(UserOperation.ChangePassword)
  @ApiResponse(UserResponse.PasswordUpdated)
  @ApiResponse(UserResponse.UserNotAuth)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiBearerAuth('accessToken')
  @UseGuards(CheckAuthGuard)
  public async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Req() req: Request
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/change-password`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @Post('login')
  @ApiOperation(UserOperation.Login)
  @ApiResponse(UserResponse.LoggedSuccess)
  @ApiResponse(UserResponse.LoggedError)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiResponse(UserResponse.UserNotFound)
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/login`,
      loginUserDto
    );
    return data;
  }

  @Get(':userId')
  @ApiOperation(UserOperation.GetUser)
  @ApiResponse(UserResponse.UserFound)
  @ApiResponse(UserResponse.UserNotFound)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiParam(UserParam.UserId)
  public async show(@Param('userId') userId: string) {
    const { data } = await this.httpService.axiosRef.get<UserRdo>(
      `${ApplicationServiceURL.Users}/${userId}`,
      {}
    );
    return data;
  }

  @Post('refresh')
  @ApiOperation(UserOperation.RefreshTokens)
  @ApiResponse(UserResponse.GetTokens)
  @ApiResponse(UserResponse.UserNotAuth)
  @ApiBearerAuth('refreshToken')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @Post('check')
  @ApiOperation(UserOperation.Check)
  @ApiResponse(UserResponse.CheckSuccess)
  @ApiResponse(UserResponse.UserNotAuth)
  @ApiBearerAuth('accessToken')
  @HttpCode(UserResponse.CheckSuccess.status)
  public async checkAuth(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/check`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }
}
