import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { TodoResponseDto, TodoDto } from './dto/todo.dto';
import { eq } from 'drizzle-orm';
import { todos } from '../db/schema';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createTodoDto: TodoDto,
    userId: string,
  ): Promise<TodoResponseDto> {
    const newTodo = await this.databaseService.db
      .insert(todos)
      .values({
        ...createTodoDto,
        userId,
      })
      .returning();

    return new TodoResponseDto(newTodo[0]);
  }

  async update(
    id: string,
    updateTodoDto: Partial<TodoDto>,
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

  async all(userId: string): Promise<TodoResponseDto[]> {
    const userTodos = await this.databaseService.getDb().query.todos.findMany({
      where: eq(todos.userId, userId),
      with: {
        tasks: true,
      },
    });

    console.log(userTodos);

    return userTodos.map((todo) => new TodoResponseDto(todo));
  }
}
