import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { eq, sql } from 'drizzle-orm';
import { tasks } from '../db/schema';

@Injectable()
export class TaskService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    // Get the next position (example: count + 1)
    const taskCount = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(eq(tasks.todoId, createTaskDto.todoId));

    const position = (taskCount[0]?.count || 0) + 1;

    const newTask = await this.databaseService.db
      .insert(tasks)
      .values({
        ...createTaskDto,
        position: position.toString(), // or however your position is formatted
      })
      .returning();

    return new TaskResponseDto(newTask[0]); // Note: returning() returns an array
  }

  async update(
    id: string,
    updateTaskDto: Partial<UpdateTaskDto>,
  ): Promise<TaskResponseDto> {
    const updatedTask = await this.databaseService.db
      .update(tasks)
      .set(updateTaskDto)
      .where(eq(tasks.id, id))
      .returning();

    if (updatedTask.length === 0) {
      throw new Error('Todo not found');
    }

    return new TaskResponseDto(updatedTask[0]);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.delete(tasks).where(eq(tasks.id, id));
  }
}
