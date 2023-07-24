import { Label } from 'src/types/label';

export interface TodoModel {
  id?: string;
  message: string;
  label: Label;
  dueDate: string;
}
