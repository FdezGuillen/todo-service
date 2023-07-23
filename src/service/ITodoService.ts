import { Injectable } from '@nestjs/common';
import { TODO } from 'src/types/todo';

@Injectable()
export abstract class ITodoService {
  /**
   * Returns all the TODO tasks saved in the database
   */
  abstract findAll(): TODO[];

  /**
   * Returns a TODO task found in the database by its id
   * @param id: string
   */
  abstract findById(id: string): TODO;

  /**
   * Saves a new TODO task and returns it once it is created
   * @param todo: TODO
   */
  abstract create(todo: TODO): Promise<TODO>;

  /**
   * Updates an already existing TODO task
   * @param id: string - The id of the existing TODO that should be updated
   * @param todo: TODO - The new data for updating the existing TODO
   */
  abstract update(id: string, todo: TODO): string;

  /**
   * Deletes an existing TODO task from the database by its id
   * @param id: string
   */
  abstract delete(id: string): string;
}
