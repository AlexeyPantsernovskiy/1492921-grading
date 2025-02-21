import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthUser, Token, UpdatePassword, User } from '@project/shared-core';
import { jwtConfig } from '@project/auth-config';
import { createJWTPayload } from '@project/shared-helpers';

import { CreateUserDto } from '../dto/create-user.dto';
import { UserMessage } from './user.constant';
import { LoginUserDto } from '../dto/login-user.dto';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';
import { UserResponse } from './user-response';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  public async register(dto: CreateUserDto): Promise<UserEntity> {
    const { email, name, password } = dto;

    const blogUser: AuthUser = {
      email,
      name,
      passwordHash: '',
    };

    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictException(UserMessage.EmailExists);
    }
    const userEntity = await new UserEntity(blogUser).setPassword(password);
    return await this.userRepository.save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email);
    if (!existUser) {
      throw new NotFoundException(UserMessage.UserNotFound);
    }

    if (!(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(UserMessage.PasswordWrong);
    }
    return existUser;
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(UserMessage.UserNotFound);
    }

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(UserMessage.UserNotFound);
    }

    return user;
  }

  public async updatePassword(dto: UpdatePassword) {
    if (!dto.userId) {
      throw new UnauthorizedException(UserResponse.UserNotAuth.description);
    }
    const existUser = await this.userRepository.findById(dto.userId);
    if (!existUser) {
      throw new NotFoundException(UserResponse.UserNotFound.description);
    }
    const login: LoginUserDto = {
      email: existUser.email,
      password: dto.oldPassword,
    };
    if (await this.verifyUser(login)) {
      const userEntity = await existUser.setPassword(dto.newPassword);
      this.userRepository.update(userEntity);
      return userEntity;
    }
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);
    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          secret: this.jwtOptions.refreshTokenSecret,
          expiresIn: this.jwtOptions.refreshTokenExpiresIn,
        }
      );
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException(
        'Ошибка при создании токена.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getUserInfo(userId: string) {
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(UserMessage.UserNotFound);
    }
    return existUser;
  }
}
