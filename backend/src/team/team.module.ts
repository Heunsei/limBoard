import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { TeamService } from './team.service';
import { TeamController } from './team.controller';

import {TeamEntity} from "./entities/team.entity";
import {TeamMemberEntity} from "./entities/teamMember.entity";
import {UserEntity} from "../user/entities/user.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([
          TeamEntity,
          TeamMemberEntity,
          UserEntity
      ])
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
