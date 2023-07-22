/**
 * DTO for TODO creation
 */
export class CreateTodoDto {
  message: string;
  label: Label;
  dueDate: Date;
}
