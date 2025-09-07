import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TodoResponseDto, TodoDto, UpdateTodoDto } from './dto/todo.dto';
import { eq, and } from 'drizzle-orm';
import { todos } from '../db/schema';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createTodoDto: TodoDto,
    userId: string,
  ): Promise<TodoResponseDto> {
    try {
      if (!createTodoDto.title?.trim()) {
        throw new BadRequestException('Title cannot be empty');
      }

      const newTodo = await this.databaseService.db
        .insert(todos)
        .values({
          ...createTodoDto,
          title: createTodoDto.title.trim(),
          userId,
        })
        .returning();

      return new TodoResponseDto(newTodo[0]);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle database constraints
      if (error.code === '23505') {
        throw new BadRequestException('Todo with this title already exists');
      }

      if (error.code === '23503') {
        throw new BadRequestException('Invalid user reference');
      }

      throw new BadRequestException('Failed to create todo');
    }
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<TodoResponseDto> {
    try {
      if (updateTodoDto.title && !updateTodoDto.title.trim()) {
        throw new BadRequestException('Title cannot be empty');
      }

      // First check if the todo exists and belongs to the user
      const existingTodo = await this.databaseService.db
        .select()
        .from(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .limit(1);

      if (existingTodo.length === 0) {
        throw new NotFoundException('Todo not found');
      }

      const updateData = updateTodoDto.title
        ? { ...updateTodoDto, title: updateTodoDto.title.trim() }
        : updateTodoDto;

      const updatedTodo = await this.databaseService.db
        .update(todos)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .returning();

      return new TodoResponseDto(updatedTodo[0]);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Handle database constraints
      if (error.code === '23505') {
        throw new BadRequestException('Todo with this title already exists');
      }

      throw new BadRequestException('Failed to update todo');
    }
  }

  async all(userId: string): Promise<TodoResponseDto[]> {
    try {
      const userTodos = await this.databaseService
        .getDb()
        .query.todos.findMany({
          where: eq(todos.userId, userId),
          with: {
            tasks: {
              orderBy: (tasks, { asc }) => [asc(tasks.position)],
            },
          },
        });

      return userTodos.map((todo) => new TodoResponseDto(todo));
    } catch (error) {
      throw new BadRequestException('Failed to retrieve todos');
    }
  }
}
