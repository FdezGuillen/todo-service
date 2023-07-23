import { Label } from 'src/types/label';
/**
 * DTO for TODO update
 */
export class UpdateTodoDto {
  message: string;
  label: Label;
  dueDate: Date;
}
