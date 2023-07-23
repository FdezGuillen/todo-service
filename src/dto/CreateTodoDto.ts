import { Label } from 'src/types/label';
/**
 * DTO for TODO creation
 */
export class CreateTodoDto {
  message: string;
  label: Label;
  dueDate: Date;
}
