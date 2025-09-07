import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import {ProjectMemberEntity} from "./entities/projectMember.entity";
import {ProjectEntity} from "./entities/project.entity";
import {TeamEntity} from "../team/entities/team.entity";
import {UserEntity} from "../user/entities/user.entity";
import {TeamMemberEntity} from "../team/entities/teamMember.entity";
import {ProjectRoleGuard} from "../auth/guard/project-role.guard";

@Module({
  imports: [
      TypeOrmModule.forFeature([
        ProjectEntity,
        ProjectMemberEntity,
        TeamEntity,
        UserEntity,
        TeamMemberEntity
      ])
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRoleGuard],
})
export class ProjectModule {}
