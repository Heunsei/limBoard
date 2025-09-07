import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { TaskService } from './task.service';
import { TaskController } from './task.controller';

import {TaskEntity} from "./entities/task.entity";
import {ProjectEntity} from "../project/entities/project.entity";
import {UserEntity} from "../user/entities/user.entity";
import {ProjectMemberEntity} from "../project/entities/projectMember.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          TaskEntity,
          ProjectEntity,
          UserEntity,
          ProjectMemberEntity,
      ])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
