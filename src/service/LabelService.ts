import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ILabelService } from './ILabelService';
import { ILabelIntegration } from 'src/integration/ILabelIntegration';

@Injectable()
export class LabelService implements ILabelService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly labelIntegration: ILabelIntegration,
  ) {}

  /**
   * Returns a list of all the available labels for use
   */
  async findAll(): Promise<Label[]> {
    try {
      const labels: Label[] = await this.labelIntegration.getAllLabels();
      return labels;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Returns a promise for retrieving a single label found by its id
   * @param id: string
   */
  async findById(id: string): Promise<Label> {
    try {
      const label: Label = await this.labelIntegration.getLabelById(id);
      return label;
    } catch (error) {
      console.log(error);
    }
  }
}
