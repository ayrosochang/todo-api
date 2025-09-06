import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World! Welcome to Todo API"', () => {
      expect(appController.getHello()).toBe('Hello World! Welcome to Todo API');
    });
  });

  describe('health', () => {
    it('should return health check object', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'todo-api');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
