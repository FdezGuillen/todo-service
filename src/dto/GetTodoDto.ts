/**
 * DTO for TODO retrieval
 */
export class GetTodoDto {
  id: string;
  message: string;
  label: Label;
  dueDate: Date;
}
