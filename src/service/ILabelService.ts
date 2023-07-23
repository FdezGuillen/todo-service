import { Injectable } from '@nestjs/common';
import { Label } from 'src/types/label';

@Injectable()
export abstract class ILabelService {
  /**
   * Returns a promise for retrieving a single label found by its id
   * @param id: string
   */
  abstract findById(id: string): Promise<Label>;
}
