import { TodoService } from './todo.service';
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
import { CreateTodoDto, UpdateTodoDto, TodoResponseDto } from './dto/todo.dto';
import { JwtAuthGuard } from '../register/guards/jwt-auth.guard';
import { CurrentUser } from '../register/decorators/current-user.decorator';
import { User } from 'src/register/types/register.types';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTodos(@CurrentUser() user: User): Promise<TodoResponseDto[]> {
    return await this.todoService.all(user.id);
  }

  @Post()
  async createTodo(
    @CurrentUser() user: User,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    return await this.todoService.create(user.id, createTodoDto);
  }

  @Patch(':id')
  async updateTodo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    await this.todoService.delete(id);
    return { message: 'Todo deleted successfully' };
  }
}
