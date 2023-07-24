import { Injectable } from '@nestjs/common';
import { ITodoService } from './ITodoService';
import { ILabelService } from './ILabelService';
import { TODO } from 'src/types/todo';
import { Label } from 'src/types/label';
import { ITodoRepository } from 'src/repository/ITodoRepository';
import { TodoModel } from 'src/schema/model/TodoModel.interface';
import { TODO_DOESNT_EXIST_ERROR } from 'src/util/ErrorMessages';

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
    try {
      const todo: TODO = this.todoRepository.findOne(id);
      if (typeof todo === 'undefined' || todo === null) {
        throw new Error(TODO_DOESNT_EXIST_ERROR);
      }
      return todo;
    } catch (error) {
      throw error;
    }
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
  async update(id: string, todo: TODO): Promise<string> {
    try {
      await this.findById(id);
      const label: Label = await this.labelService.findById(todo.label.id);
      todo.label = label;
      const todoToUpdate: TodoModel = this.mapToDocument(todo);
      return this.todoRepository.update(id, todoToUpdate);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an existing TODO task from the database by its id
   * @param id: string
   */
  async delete(id: string): Promise<string> {
    try {
      await this.findById(id);
      return this.todoRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Maps a TODO to an object adequate for database schema operations
   * @param todo - TODO
   * @returns TODO in TodoModel format
   */
  mapToDocument(todo: TODO): TodoModel {
    const dateString: string =
      todo.dueDate instanceof Date
        ? todo.dueDate.toISOString()
        : new Date(todo.dueDate).toISOString();
    return {
      message: todo.message,
      label: todo.label,
      dueDate: dateString,
    };
  }
}
