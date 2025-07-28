import {Controller, Post, Body, Req, ValidationPipe, UsePipes,} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Authorization } from './decorator/authorization.decorator';
import {RegisterUserDto} from "./dto/registerUser.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Authorization('authorization') token: string){
    return this.authService.login(token)
  }

  @Post('register')
  registerUser(
      @Authorization('authorization') token: string,
      @Body() registerUserDto: RegisterUserDto,
      ){
    return this.authService.register(token, {...registerUserDto})
  }
}
