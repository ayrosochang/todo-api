import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterModule } from './register/register.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [RegisterModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
