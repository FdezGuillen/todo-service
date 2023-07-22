import { Injectable } from '@nestjs/common';
import { ITodoService } from './ITodoService';
import { ILabelService } from './ILabelService';

@Injectable()
export class TodoService implements ITodoService {
  constructor(private readonly labelService: ILabelService) {}

  private readonly todoList: TODO[] = [];

  /**
   * Returns all the TODO tasks saved in the database
   */
  findAll(): TODO[] {
    return this.todoList;
  }

  /**
   * Returns a TODO task found in the database by its id
   * @param id: string
   */
  findById(id: string): TODO {
    return this.todoList.find((todo: TODO) => todo.id === id);
  }

  /**
   * Saves a new TODO task and returns it once it is created
   * @param todo: TODO
   */
  create(todo: TODO): TODO {
    todo.id = 'id' + this.todoList.length;
    this.todoList.push(todo);
    return todo;
  }

  /**
   * Updates an already existing TODO task
   * @param id: string - The id of the existing TODO that should be updated
   * @param todo: TODO - The new data for updating the existing TODO
   */
  update(id: string, todo: TODO): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.findById(id));
    this.todoList[originalTodoIndex] = todo;
    return 'Updated successfully';
  }

  /**
   * Deletes an existing TODO task from the database by its id
   * @param id: string
   */
  delete(id: string): string {
    const originalTodoIndex: number = this.todoList.indexOf(this.findById(id));
    this.todoList.splice(originalTodoIndex, 1);
    return 'Deleted successfully';
  }
}
