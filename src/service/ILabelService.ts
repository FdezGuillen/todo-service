import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ILabelService {
  abstract findAll(): Label[];
  abstract findById(id: string): Label;
}
