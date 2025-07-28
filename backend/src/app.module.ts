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
import {UserEntity} from "./user/entities/user.entity";
import {TaskEntity} from "./task/entities/task.entity";
import {ProjectEntity} from "./project/entities/project.entity";
import {ProjectMemberEntity} from "./project/entities/projectMember.entity";
import {TeamEntity} from "./team/entities/team.entity";
import {TeamMemberEntity} from "./team/entities/teamMember.entity";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env',
        validationSchema: Joi.object({
            ENV: Joi.string().valid('test', 'dev', 'prod').required(),
            HASH_ROUNDS: Joi.number().required(),
            ACCESS_TOKEN_SECRET: Joi.string().required(),
            REFRESH_TOKEN_SECRET: Joi.string().required(),
        })
      }),
      TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
              host: configService.get<string>(envVariablesKeys.dbHost),
              type: configService.get<string>(envVariablesKeys.dbType) as 'postgres',
              port: configService.get<number>(envVariablesKeys.dbPort),
              username: configService.get<string>(envVariablesKeys.dbUsername),
              password: configService.get<string>(envVariablesKeys.dbPassword),
              database: configService.get<string>(envVariablesKeys.dbDatabase),
              entities: [
                  UserEntity,
                  TaskEntity,
                  ProjectEntity,
                  ProjectMemberEntity,
                  TeamEntity,
                  TeamMemberEntity,
              ],
              synchronize: true,
          }),
          inject: [ConfigService],
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
