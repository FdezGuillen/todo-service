import { Injectable } from '@nestjs/common';
import { Label } from 'src/types/label';

@Injectable()
export abstract class ILabelIntegration {
  /**
   * Calls the /labels/{id} endpoint from an external Label service. Returns an AxiosResponse promise expecting a specific label found by the provided id
   * @param id: string
   */
  abstract getLabelById(id: string): Promise<Label>;
}
