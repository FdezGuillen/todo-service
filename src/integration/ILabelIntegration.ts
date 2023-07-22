import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export abstract class ILabelIntegration {
  /**
   * Calls the /labels endpoint from an external Label service. Returns an AxiosResponse promise expecting all the available labels for use
   */
  abstract getAllLabels(): Promise<Label[]>;

  /**
   * Calls the /labels/{id} endpoint from an external Label service. Returns an AxiosResponse promise expecting a specific label found by the provided id
   * @param id: string
   */
  abstract getLabelById(id: string): Promise<Label>;
}
