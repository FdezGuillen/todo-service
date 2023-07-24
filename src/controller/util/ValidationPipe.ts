import * as Joi from 'joi';

/**
 * Joi object for being passed to a custom TODO validation pipe
 */
export const createTodoSchema = Joi.object({
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
    .error(
      new Error(
        'Message is missing or not valid (min length 1, max length 500)',
      ),
    ),
  label: Joi.object({
    id: Joi.string().required(),
  })
    .required()
    .error(new Error('Label id is missing or not valid')),
  dueDate: Joi.date()
    .iso()
    .required()
    .error(new Error('Date is missing or not a valid ISO-8601 date')),
});
