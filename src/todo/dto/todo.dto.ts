export class TodoResponseDto {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(todo: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description || '';
    this.completed = todo.completed;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}

export class CreateTodoDto {
  title: string;
  description?: string;
}

export class UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}
