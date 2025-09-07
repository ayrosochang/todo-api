import { TaskResponseDto } from 'src/task/dto/task.dto';
import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional } from 'class-validator';

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
    // Convert raw task data to TaskResponseDto instances
    this.tasks = todo.tasks
      ? todo.tasks.map((task) => new TaskResponseDto(task))
      : [];
  }
}

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;
}
