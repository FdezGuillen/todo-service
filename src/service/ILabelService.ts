import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ILabelService {
  /**
   * Returns a list of all the available labels for use
   */
  abstract findAll(): Promise<Label[]>;

  /**
   * Returns a promise for retrieving a single label found by its id
   * @param id: string
   */
  abstract findById(id: string): Promise<Label>;
}
