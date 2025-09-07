import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.taskService.create(createTaskDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('project/:projectId')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.taskService.findAllByProject(projectId);
  }

  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.taskService.findAllByUserId(userId);
  }

  @Get('team/:teamId')
  findAllByTeam(@Param('teamId') teamId: string) {
    return this.taskService.findAllByTeam(teamId);
  }

  @Get('my-tasks')
  findMyTasks(
    @Request() req: any,
    @Query('projectId') projectId?: string,
    @Query('status') status?: string
  ) {
    return this.taskService.findMyTasks(req.user.sub, { projectId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req: any) {
    return this.taskService.update(id, updateTaskDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.taskService.remove(id, req.user.sub);
  }
}
