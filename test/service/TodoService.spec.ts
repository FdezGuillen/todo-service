import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { ILabelIntegration } from 'src/integration/ILabelIntegration';
import { LabelIntegration } from 'src/integration/LabelIntegration';
import { ITodoRepository } from 'src/repository/ITodoRepository';
import { TodoRepository } from 'src/repository/TodoRepository';
import { TodoModel } from 'src/schema/model/TodoModel.interface';
import { ILabelService } from 'src/service/ILabelService';
import { ITodoService } from 'src/service/ITodoService';
import { LabelService } from 'src/service/LabelService';
import { TodoService } from 'src/service/TodoService';
import { TODO } from 'src/types/todo';
import { TODO_DOESNT_EXIST_ERROR } from 'src/util/ErrorMessages';

describe('TodoService', () => {
  const label = {
    id: '001',
    name: 'Test label',
  };
  const todoResults = [
    {
      id: 'd21b33b4-8717-4350-a859-e67d495c0575',
      message: 'Test TODO 1',
      label: {
        name: 'Label saved in DB',
        id: '0002',
      },
      dueDate: '2023-07-25T00:00:00.000Z',
    },
    {
      id: '1816ab4e-63de-40bb-bfaf-1b88aa99c864',
      message: 'Test TODO 2',
      label: {
        name: 'Test label',
        id: '0001',
      },
      dueDate: '2023-07-25T00:00:00.000Z',
    },
  ];

  const httpService = {
    get: jest.fn(),
  };
  const cacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const todoRepositoryMock = {
    findAll: jest.fn().mockImplementation(() => {
      return todoResults;
    }),
    findOne: jest.fn().mockImplementation((key: string) => {
      return todoResults.find((todo) => todo.id == key);
    }),
    create: jest.fn().mockImplementation((todo) => {
      return todo;
    }),
    update: jest.fn().mockImplementation((key: string, todo) => {
      const todoIndex = todoResults.indexOf(
        todoResults.find((t) => t.id == key),
      );
      if (todoIndex < 0) {
        throw new Error(TODO_DOESNT_EXIST_ERROR);
      }
      todoResults[todoIndex] = todo;
      return todo;
    }),
    delete: jest.fn().mockImplementation(() => {
      return '';
    }),
  };
  let labelIntegration: LabelIntegration;
  let labelService: LabelService;
  let todoService: TodoService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: HttpService, useValue: httpService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        {
          provide: ITodoRepository,
          useValue: todoRepositoryMock,
        },
        {
          provide: ILabelIntegration,
          useClass: LabelIntegration,
        },
        {
          provide: ILabelService,
          useClass: LabelService,
        },
        {
          provide: ITodoService,
          useClass: TodoService,
        },
      ],
    }).compile();

    labelIntegration = moduleRef.get<LabelIntegration>(ILabelIntegration);
    labelService = moduleRef.get<LabelService>(ILabelService);
    todoService = moduleRef.get<TodoService>(ITodoService);
  });

  it('[TodoService] Find all TODO', async () => {
    const foundTodos = await todoService.findAll();
    expect(foundTodos.length).toEqual(todoResults.length);
    for (let i = 0; i < foundTodos.length; i++) {
      expect(foundTodos[i].id).toEqual(todoResults[i].id);
      expect(foundTodos[i].message).toEqual(todoResults[i].message);
      expect(foundTodos[i].label.id).toEqual(todoResults[i].label.id);
      expect(foundTodos[i].label.name).toEqual(todoResults[i].label.name);
      expect(foundTodos[i].dueDate).toEqual(todoResults[i].dueDate);
    }
  });

  it('[TodoService] Find one TODO', async () => {
    const foundTodo = await todoService.findById(todoResults[0].id);
    expect(foundTodo.id).toEqual(todoResults[0].id);
    expect(foundTodo.message).toEqual(todoResults[0].message);
    expect(foundTodo.label.id).toEqual(todoResults[0].label.id);
    expect(foundTodo.label.name).toEqual(todoResults[0].label.name);
    expect(foundTodo.dueDate).toEqual(todoResults[0].dueDate);
  });

  it('[TodoService] Find one non existent TODO error', async () => {
    await expect(async () => {
      return todoService.findById('wrongId');
    }).rejects.toThrow(Error);
  });

  it('[TodoService] Create TODO', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockResolvedValue(label);
    const newTodo: TODO = {
      message: todoResults[0].message,
      label: todoResults[0].label,
      dueDate: new Date(todoResults[0].dueDate),
    };
    const createdTodo = await todoService.create(newTodo);
    expect(createdTodo.message).toEqual(newTodo.message);
    expect(createdTodo.label.id).toEqual(newTodo.label.id);
    expect(createdTodo.label.name).toEqual(newTodo.label.name);
    expect(createdTodo.dueDate).toEqual(newTodo.dueDate.toISOString());
  });

  it('[TodoService] Create TODO with wrong label', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockImplementation(() => {
      throw new Error();
    });
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    jest.spyOn(labelService, 'findById').mockImplementation(() => {
      throw new Error();
    });

    const newTodo: TODO = {
      message: todoResults[0].message,
      label: {
        id: 'wrongLabelId',
      },
      dueDate: new Date(todoResults[0].dueDate),
    };
    await expect(async () => {
      return todoService.create(newTodo);
    }).rejects.toThrow(Error);
  });

  it('[TodoService] Update TODO', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockResolvedValue(label);
    const newTodo: TODO = {
      message: 'New message',
      label: todoResults[0].label,
      dueDate: new Date(todoResults[0].dueDate),
    };
    await todoService.update(todoResults[0].id, newTodo);
    expect(newTodo.message).toEqual(todoResults[0].message);
    expect(newTodo.label.id).toEqual(todoResults[0].label.id);
    expect(newTodo.label.name).toEqual(todoResults[0].label.name);
  });

  it('[TodoService] Update TODO with wrong id error', async () => {
    jest.spyOn(labelIntegration, 'getLabelById').mockResolvedValue(label);
    const newTodo: TODO = {
      message: 'New message',
      label: todoResults[0].label,
      dueDate: new Date(todoResults[0].dueDate),
    };
    await expect(async () => {
      return todoService.update('wrongId', newTodo);
    }).rejects.toThrow(Error);
  });

  it('[TodoService] Delete TODO', async () => {
    const result = await todoService.delete(todoResults[0].id);
    expect(result).toEqual('');
  });
});
