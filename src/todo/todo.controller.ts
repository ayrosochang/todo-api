import {
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../register/guards/jwt-auth.guard';
import { CurrentUser } from '../register/decorators/current-user.decorator';
import { User } from 'src/register/types/register.types';
import { TodoService } from 'src/todo/todo.service';
import { TodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  @Put(':id')
  async updateTodo(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return await this.todoService.update(id, updateTodoDto, user.id);
  }
}
