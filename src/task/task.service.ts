import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/database.service';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { eq, sql, and, gt, lt, asc, desc } from 'drizzle-orm';
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
        position: position.toString(),
      })
      .returning();

    return new TaskResponseDto(newTask[0]);
  }

  async update(
    id: string,
    updateTaskDto: Partial<UpdateTaskDto>,
  ): Promise<TaskResponseDto> {
    // If position is being updated, handle reordering
    if (updateTaskDto.position !== undefined) {
      await this.reorderTask(id, updateTaskDto.position);
    }

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

  private async reorderTask(
    taskId: string,
    newPosition: string,
  ): Promise<void> {
    // Validate position is a valid number
    const targetPosition = parseFloat(newPosition);
    if (isNaN(targetPosition) || targetPosition < 0) {
      throw new Error('Invalid position value');
    }

    // Get the current task to find its todoId
    const currentTask = await this.databaseService.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (currentTask.length === 0) {
      throw new Error('Task not found');
    }

    const task = currentTask[0];
    const todoId = task.todoId;
    const currentPosition = parseFloat(task.position);

    // If positions are the same, no need to reorder
    if (Math.abs(currentPosition - targetPosition) < 0.0001) {
      return;
    }

    // Calculate new position based on surrounding tasks
    let newPos: number;

    if (targetPosition > currentPosition) {
      // Moving down - find the task with the next higher position
      const nextTask = await this.databaseService.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.todoId, todoId),
            gt(tasks.position, targetPosition.toString()),
          ),
        )
        .orderBy(asc(tasks.position))
        .limit(1);

      if (nextTask.length > 0) {
        // Insert between target and next
        const nextPosition = parseFloat(nextTask[0].position);
        newPos = (targetPosition + nextPosition) / 2;
      } else {
        // No task after target position, just use target + 1
        newPos = targetPosition + 1;
      }
    } else {
      // Moving up - find the task with the next lower position
      const prevTask = await this.databaseService.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.todoId, todoId),
            lt(tasks.position, targetPosition.toString()),
          ),
        )
        .orderBy(desc(tasks.position))
        .limit(1);

      if (prevTask.length > 0) {
        // Insert between prev and target
        const prevPosition = parseFloat(prevTask[0].position);
        newPos = (prevPosition + targetPosition) / 2;
      } else {
        // No task before target position, use target position or 0 if negative
        newPos = Math.max(0, targetPosition);
      }
    }

    // Update the task position
    await this.databaseService.db
      .update(tasks)
      .set({ position: newPos.toString() })
      .where(eq(tasks.id, taskId));
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.delete(tasks).where(eq(tasks.id, id));
  }

  async findAllByTodoId(todoId: string): Promise<TaskResponseDto[]> {
    const todoTasks = await this.databaseService.db
      .select()
      .from(tasks)
      .where(eq(tasks.todoId, todoId))
      .orderBy(asc(tasks.position));

    return todoTasks.map((task) => new TaskResponseDto(task));
  }
}
