import { Injectable } from '@nestjs/common';
import { TodoModel } from 'src/schema/model/TodoModel.interface';

@Injectable()
export abstract class ITodoRepository {
  abstract findOne(key: string);
  abstract findAll();
  abstract create(todo: TodoModel);
  abstract update(key: string, todo: TodoModel);
  abstract delete(key: string);
}
