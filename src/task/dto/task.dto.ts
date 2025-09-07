import { IsOptional, IsString, IsBoolean, IsNumberString } from 'class-validator';

export class TaskResponseDto {
  id: string;
  todoId: string;
  title: string;
  description: string;
  completed: boolean;
  position: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(task: {
    id: string;
    todoId: string;
    title: string;
    description: string | null;
    completed: boolean;
    position: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = task.id;
    this.todoId = task.todoId;
    this.title = task.title;
    this.description = task.description || '';
    this.completed = task.completed;
    this.position = task.position;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}

export class CreateTaskDto {
  todoId: string;
  title: string;
  description?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumberString()
  position?: string; // New position for reordering
}
