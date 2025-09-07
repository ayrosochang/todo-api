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
import { JwtAuthGuard } from '../register/guards/jwt-auth.guard';
import { CurrentUser } from '../register/decorators/current-user.decorator';
import { User } from 'src/register/types/register.types';
import { TodoService } from 'src/todo/todo.service';
import { TodoDto, TodoResponseDto } from './dto/todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(
    @CurrentUser() user: User,
    @Body() createTodoDto: TodoDto,
  ): Promise<TodoResponseDto> {
    return await this.todoService.create(createTodoDto, user.id);
  }

  @Get()
  async getTodos(@CurrentUser() user: User): Promise<TodoResponseDto[]> {
    return await this.todoService.all(user.id);
  }
}
