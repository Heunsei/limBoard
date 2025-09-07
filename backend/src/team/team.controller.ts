import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddUserDto } from './dto/add-user.dto';
import { Role } from '../auth/decorator/role.decorator';
import { TeamRole } from './entities/teamMember.entity';

import {Request} from "express";
import {Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards} from '@nestjs/common';
import { RoleGuard } from '../auth/guard/role.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
      @Body() createTeamDto: CreateTeamDto,
      @Req() req: Request,
  ) {
      return this.teamService.create(createTeamDto, req.user.sub);
  }

  @Get()
  findAll(
      @Req() req: Request,
  ) {
    return this.teamService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.teamService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Role(TeamRole.manager)
  update(
    @Param('id') id: string, 
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Post(':id/add-user')
  @UseGuards(RoleGuard)
  @Role(TeamRole.manager)
  addUser(
    @Param('id') teamId: string,
    @Body() addUserDto: AddUserDto,
  ) {
    return this.teamService.addUser(teamId, addUserDto.email, addUserDto.role);
  }

  @Delete(':id/remove-user/:userId')
  @UseGuards(RoleGuard)
  @Role(TeamRole.manager)
  removeUser(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.removeUser(teamId, userId);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Role(TeamRole.admin)
  remove(
    @Param('id') id: string,
  ) {
    return this.teamService.remove(id);
  }
}
