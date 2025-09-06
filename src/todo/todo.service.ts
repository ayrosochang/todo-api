import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';
import { eq, sql } from 'drizzle-orm';
import { todos } from '../db/schema';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async all(userId: string): Promise<TodoResponseDto[]> {
    const todoList = await this.databaseService.db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId));
    return todoList.map((todo) => new TodoResponseDto(todo));
  }

  async create(
    userId: string,
    createTodoDto: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    // Get the next position (example: count + 1)
    const todoCount = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(todos)
      .where(eq(todos.userId, userId));

    const position = (todoCount[0]?.count || 0) + 1;

    const newTodo = await this.databaseService.db
      .insert(todos)
      .values({
        ...createTodoDto,
        userId,
        position: position.toString(), // or however your position is formatted
      })
      .returning();

    return new TodoResponseDto(newTodo[0]); // Note: returning() returns an array
  }

  async update(
    id: string,
    updateTodoDto: Partial<UpdateTodoDto>,
  ): Promise<TodoResponseDto> {
    const updatedTodo = await this.databaseService.db
      .update(todos)
      .set(updateTodoDto)
      .where(eq(todos.id, id))
      .returning();

    if (updatedTodo.length === 0) {
      throw new Error('Todo not found');
    }

    return new TodoResponseDto(updatedTodo[0]);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.delete(todos).where(eq(todos.id, id));
  }
}
