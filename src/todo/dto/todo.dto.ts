import { TaskResponseDto } from 'src/task/dto/task.dto';

export class TodoResponseDto {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tasks?: TaskResponseDto[];

  constructor(todo: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    tasks?: TaskResponseDto[];
  }) {
    this.id = todo.id;
    this.title = todo.title || '';
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
    this.tasks = todo.tasks || [];
  }
}

export class TodoDto {
  title: string;
}
