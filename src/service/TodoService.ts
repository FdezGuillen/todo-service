import { Injectable } from '@nestjs/common';
import { ITodoService } from './ITodoService';
import { ILabelService } from './ILabelService';
import { TODO } from 'src/types/todo';
import { Label } from 'src/types/label';
import { ITodoRepository } from 'src/repository/ITodoRepository';
import { TodoModel } from 'src/schema/model/TodoModel.interface';

@Injectable()
export class TodoService implements ITodoService {
  constructor(
    private readonly labelService: ILabelService,
    private todoRepository: ITodoRepository,
  ) {}

  private readonly todoList: TODO[] = [];

  /**
   * Returns all the TODO tasks saved in the database
   */
  findAll(): TODO[] {
    return this.todoRepository.findAll();
  }

  /**
   * Returns a TODO task found in the database by its id
   * @param id: string
   */
  findById(id: string): TODO {
    return this.todoRepository.findOne(id);
  }

  /**
   * Saves a new TODO task and returns it once it is created
   * @param todo: TODO
   */
  async create(todo: TODO): Promise<TODO> {
    const label: Label = await this.labelService.findById(todo.label.id);
    todo.label = label;
    const todoToSave: TodoModel = this.mapToDocument(todo);
    return this.todoRepository.create(todoToSave);
  }

  /**
   * Updates an already existing TODO task
   * @param id: string - The id of the existing TODO that should be updated
   * @param todo: TODO - The new data for updating the existing TODO
   */
  update(id: string, todo: TODO): string {
    this.validateIfTodoExists(id);
    const todoToUpdate: TodoModel = this.mapToDocument(todo);
    return this.todoRepository.update(id, todoToUpdate);
  }

  /**
   * Deletes an existing TODO task from the database by its id
   * @param id: string
   */
  delete(id: string): string {
    this.validateIfTodoExists(id);
    return this.todoRepository.delete(id);
  }

  validateIfTodoExists(id: string) {
    const originalTodo: TODO = this.findById(id);
    if (typeof originalTodo === 'undefined' || originalTodo === null) {
      throw Error("TODO task doesn't exist");
    }
  }

  mapToDocument(todo: TODO): TodoModel {
    const dateString: string =
      typeof todo.dueDate === 'string'
        ? todo.dueDate
        : todo.dueDate.toISOString();
    return {
      message: todo.message,
      label: todo.label,
      dueDate: dateString,
    };
  }
}
