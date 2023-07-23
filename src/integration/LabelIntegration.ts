import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ILabelIntegration } from './ILabelIntegration';
import { getAllLabelsPath, getLabelByIdPath } from './util/LabelRoutes.const';
import { Label } from 'src/types/label';

@Injectable()
export class LabelIntegration implements ILabelIntegration {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Calls the /labels endpoint from an external Label service. Returns ae promise expecting all the available labels for use
   */
  getAllLabels(): Promise<Label[]> {
    return this.httpService.axiosRef
      .get<Label[]>(getAllLabelsPath)
      .then((response: AxiosResponse) => {
        return response.data;
      });
  }

  /**
   * Calls the /labels/{id} endpoint from an external Label service. Returns a promise expecting a specific label found by the provided id
   * @param id: string
   */
  getLabelById(id: string): Promise<Label> {
    return this.httpService.axiosRef
      .get<Label>(getLabelByIdPath(id))
      .then((response: AxiosResponse) => {
        return response.data;
      });
  }
}
