import {JwtModule} from "@nestjs/jwt";
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import {UserModule} from "../user/user.module";
import {UserEntity} from "../user/entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          UserEntity,
      ]),
      JwtModule.register({
          global: true,
      }),
      UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModule],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
