export class TaskResponseDto {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(task: {
    id: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = task.id;
    this.description = task.description || '';
    this.completed = task.completed;
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
  title?: string;
  description?: string;
  completed?: boolean;
}
