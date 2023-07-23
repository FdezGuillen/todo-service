import { GetTodoDto } from 'src/dto/GetTodoDto';
import { TODO } from 'src/types/todo';

export const mapToGetTodoDto = (todo: TODO): GetTodoDto => {
  const dateString: string =
    todo.dueDate instanceof Date ? todo.dueDate.toISOString() : todo.dueDate;
  return {
    id: todo.id,
    message: todo.message,
    label: todo.label,
    dueDate: dateString,
  };
};

export const mapToGetTodoDtoList = (todoList: TODO[]): GetTodoDto[] => {
  return todoList.map((todo) => {
    return mapToGetTodoDto(todo);
  });
};
