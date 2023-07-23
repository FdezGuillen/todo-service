import { ConfigModule } from '@nestjs/config';
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
import { DynamooseModule } from 'nestjs-dynamoose';
import { TodoSchema } from './schema/TodoSchema';
import { ITodoRepository } from './repository/ITodoRepository';
import { TodoRepository } from './repository/TodoRepository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DynamooseModule.forRoot({
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    }),
    DynamooseModule.forFeature([
      {
        name: 'TodoModel',
        schema: TodoSchema,
        options: {
          tableName: 'todo',
        },
      },
    ]),
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [AppController, TodoController],
  providers: [
    AppService,
    {
      provide: ITodoRepository,
      useClass: TodoRepository,
    },
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
