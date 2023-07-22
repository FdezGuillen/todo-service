import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ITodoService {
  abstract findAll(): TODO[];
  abstract findById(id: string): TODO;
  abstract create(todo: TODO): TODO;
  abstract update(id: string, todo: TODO): string;
  abstract delete(id: string): string;
}
