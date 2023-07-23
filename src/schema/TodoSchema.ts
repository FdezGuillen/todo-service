import { randomUUID } from 'crypto';
import * as dynamoose from 'dynamoose';

export const TodoSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: randomUUID(),
    },
    message: {
      type: String,
      required: true,
    },
    label: {
      type: Object,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
  },
  {
    saveUnknown: true,
  },
);
