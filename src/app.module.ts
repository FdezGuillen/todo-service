import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './controller/TodoController';
import { TodoService } from './service/TodoService';
import { ITodoService } from './service/ITodoService';
import { ILabelService } from './service/ILabelService';
import { LabelService } from './service/LabelService';
import { ILabelIntegration } from './integration/ILabelIntegration';
import { LabelIntegration } from './integration/LabelIntegration';

@Module({
  imports: [CacheModule.register(), HttpModule],
  controllers: [AppController, TodoController],
  providers: [
    AppService,
    {
      provide: ILabelIntegration,
      useClass: LabelIntegration,
    },
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
