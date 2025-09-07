import { TaskService } from './task.service';
import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dto/task.dto';
import { JwtAuthGuard } from '../register/guards/jwt-auth.guard';
import { CurrentUser } from '../register/decorators/current-user.decorator';
import { User } from 'src/register/types/register.types';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @CurrentUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return await this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  async updateTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    await this.taskService.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
