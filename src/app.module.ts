import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './controller/TodoController';
import { TodoService } from './service/TodoService';
import { ITodoService } from './service/ITodoService';
import { ILabelService } from './service/ILabelService';
import { LabelService } from './service/LabelService';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController, TodoController],
  providers: [
    AppService,
    {
      provide: ITodoService,
      useClass: TodoService,
    },
    {
      provide: ILabelService,
      useClass: LabelService,
    },
  ],
})
export class AppModule {}
