import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { ILabelIntegration } from './ILabelIntegration';
import { getLabelByIdPath } from './util/LabelRoutes.const';
import { Label } from 'src/types/label';
import {
  LABEL_DOESNT_EXIST_ERROR,
  LABEL_SERVICE_ERROR,
} from 'src/util/ErrorMessages';

@Injectable()
export class LabelIntegration implements ILabelIntegration {
  constructor(private readonly httpService: HttpService) {}
  /**
   * Calls the /labels/{id} endpoint from an external Label service. Returns a promise expecting a specific label found by the provided id
   * @param id: string
   */
  getLabelById(id: string): Promise<Label> {
    return this.httpService.axiosRef
      .get<Label>(getLabelByIdPath(id))
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        if (error.response.status == 404) {
          throw new Error(LABEL_DOESNT_EXIST_ERROR);
        }
        throw new Error(LABEL_SERVICE_ERROR);
      });
  }
}
