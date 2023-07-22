import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ILabelService } from './ILabelService';

@Injectable()
export class LabelService implements ILabelService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  findAll(): Label[] {
    return [];
  }

  findById(id: string): Label {
    return { id: id };
  }
}
