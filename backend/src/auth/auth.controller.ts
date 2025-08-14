import {Controller, Post, Body, Res} from '@nestjs/common';
import {Response} from 'express';

import {AuthService} from './auth.service';
import {Authorization} from './decorator/authorization.decorator';
import {RegisterUserDto} from "./dto/registerUser.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
      @Authorization('authorization') token: string,
      @Res({ passthrough: true }) response: Response,
  ){
      const { accessToken, refreshToken } = await this.authService.login(token);

      response.cookie(
          'refreshToken',
          refreshToken,
          {
              httpOnly: true,
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60 * 1000,
          }
      );

      return {
          accessToken,
      }
  }

  @Post('register')
  registerUser(
      @Authorization('authorization') token: string,
      @Body() registerUserDto: RegisterUserDto,
      ){
    return this.authService.register(token, {...registerUserDto})
  }

  @Post('refresh')
  refreshToken(@Authorization('authorization') token: string){
      return this.authService.refreshToken(token);
  }
}
