import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {envVariablesKeys} from "./common/const/env.const";
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { CommonModule } from './common/common.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
        validationSchema: Joi.object({
            ENV: Joi.string().valid('test', 'dev', 'prod').required(),
        })
      }),
      TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
              host: configService.get<string>(envVariablesKeys.dbHost),
              port: configService.get<number>(envVariablesKeys.dbPort),
              username: configService.get<string>(envVariablesKeys.dbUsername),
              password: configService.get<string>(envVariablesKeys.dbPassword),
              database: configService.get<string>(envVariablesKeys.dbDatabase),
          })
      }),
      UserModule,
      AuthModule,
      TeamModule,
      ProjectModule,
      TaskModule,
      CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
