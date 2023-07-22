import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  private readonly todoList: TODO[] = [];

  findAll(): TODO[] {
    return this.todoList;
  }

  find(id: string): TODO {
    return this.todoList.find((todo: TODO) => todo.id === id);
  }

  create(todo: TODO): string {
    this.todoList.push(todo);
    return todo.id;
  }

  update(id: string, todo: TODO): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.find(id));
    this.todoList[originalTodoIndex] = todo;
    return 'Updated successfully';
  }

  delete(id: string): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.find(id));
    this.todoList.splice(originalTodoIndex, 1);
    return 'Deleted successfully';
  }
}
