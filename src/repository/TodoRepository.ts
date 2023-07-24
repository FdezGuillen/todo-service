import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { TodoModel } from 'src/schema/model/TodoModel.interface';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel('TodoModel')
    private todoModel: Model<TodoModel, string>,
  ) {}

  findOne(key: string) {
    return this.todoModel.get(key);
  }

  findAll() {
    return this.todoModel.scan().exec();
  }

  create(todo: TodoModel) {
    return this.todoModel.create(todo);
  }

  update(key: string, todo: TodoModel) {
    return this.todoModel.update(key, todo);
  }

  delete(key: string) {
    return this.todoModel.delete(key);
  }
}
