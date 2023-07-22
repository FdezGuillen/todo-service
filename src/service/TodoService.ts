import { Injectable } from '@nestjs/common';
import { ITodoService } from './ITodoService';

@Injectable()
export class TodoService implements ITodoService {
  private readonly todoList: TODO[] = [];

  findAll(): TODO[] {
    return this.todoList;
  }

  findById(id: string): TODO {
    return this.todoList.find((todo: TODO) => todo.id === id);
  }

  create(todo: TODO): TODO {
    todo.id = 'id' + this.todoList.length;
    this.todoList.push(todo);
    return todo;
  }

  update(id: string, todo: TODO): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.findById(id));
    this.todoList[originalTodoIndex] = todo;
    return 'Updated successfully';
  }

  delete(id: string): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.findById(id));
    this.todoList.splice(originalTodoIndex, 1);
    return 'Deleted successfully';
  }
}
