import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ILabelService } from './ILabelService';
import { ILabelIntegration } from 'src/integration/ILabelIntegration';
import { Label } from 'src/types/label';

@Injectable()
export class LabelService implements ILabelService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly labelIntegration: ILabelIntegration,
  ) {}

  CACHE_TTL_MILLISECONDS = 3600000;
  /**
   * Returns a promise for retrieving a single label found by its id
   * @param id: string
   */
  async findById(id: string): Promise<Label> {
    try {
      let label: Label = await this.cacheManager.get(id);
      if (typeof label === 'undefined' || label === null) {
        label = await this.labelIntegration.getLabelById(id);
        this.cacheManager.set(id, label, this.CACHE_TTL_MILLISECONDS);
      }
      return label;
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }
}
