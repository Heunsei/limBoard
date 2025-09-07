import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ProjectRoleGuard } from '../auth/guard/project-role.guard';
import { ProjectRole } from '../auth/decorator/project-role.decorator';
import { projectRole } from './entities/projectMember.entity';

@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    return this.projectService.create(createProjectDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(ProjectRoleGuard)
  @ProjectRole(projectRole.admin)
  updateStatus(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateStatus(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(ProjectRoleGuard)
  @ProjectRole(projectRole.admin)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }

  @Post(':id/members')
  @UseGuards(ProjectRoleGuard)
  @ProjectRole(projectRole.admin)
  addMember(@Param('id') projectId: string, @Body() addMemberDto: AddMemberDto) {
    return this.projectService.addMember(projectId, addMemberDto);
  }

  @Delete(':id/members/:userId')
  @UseGuards(ProjectRoleGuard)
  @ProjectRole(projectRole.admin)
  removeMember(@Param('id') projectId: string, @Param('userId') userId: string, @Request() req: any) {
    return this.projectService.removeMember(projectId, userId, req.user.sub);
  }
}
