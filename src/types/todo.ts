import { Label } from './label';

/**
 *  TODO task an user can create
 * */
export type TODO = {
  id?: string; // Autogenerated
  message: string;
  label: Label;
  dueDate: Date; // Datetime in ISO-8601 format
};
