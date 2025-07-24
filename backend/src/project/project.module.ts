import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import {ProjectMemberEntity} from "./entities/projectMember.entity";
import {ProjectEntity} from "./entities/project.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        ProjectEntity,
        ProjectMemberEntity
      ])
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
