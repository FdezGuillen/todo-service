import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetTodoDto } from 'src/dto/GetTodoDto';
import { CreateTodoDto } from 'src/dto/CreateTodoDto';
import { UpdateTodoDto } from 'src/dto/UpdateTodoDto';
import { mapToGetTodoDto, mapToGetTodoDtoList } from './util/ControllerUtils';
import { ITodoService } from 'src/service/ITodoService';
import { JoiValidationPipe } from './util/JoiValidationPipe';
import { createTodoSchema } from './util/ValidationPipe';
import { TODO } from 'src/types/todo';
import {
  INTERNAL_SERVER_ERROR,
  LABEL_DOESNT_EXIST_ERROR,
  LABEL_SERVICE_ERROR,
  TODO_DOESNT_EXIST_ERROR,
} from 'src/util/ErrorMessages';

@Controller('todo')
export class TodoController {
  constructor(private todoService: ITodoService) {}

  /**
   * Gets all the TODOs in the database
   * @returns GetTodoDto[]
   */
  @Get()
  async findAll(): Promise<GetTodoDto[] | string> {
    try {
      const todoList: TODO[] = await this.todoService.findAll();
      return mapToGetTodoDtoList(todoList);
    } catch (error) {
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Finds a TODO by its id
   * @param uuid - uuid
   * @returns GetTodoDto
   */
  @Get(':uuid')
  async findOne(
    @Param('uuid', new ParseUUIDPipe()) id: string,
  ): Promise<GetTodoDto> {
    try {
      const todo: TODO = await this.todoService.findById(id);
      return mapToGetTodoDto(todo);
    } catch (error) {
      if (error.message === TODO_DOESNT_EXIST_ERROR) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Saves a TODO, returns it after creation
   * @param createTodoDto - CreateTodoDto
   * @returns GetTodoDto - The created TODO
   */
  @Post()
  async create(
    @Body(new JoiValidationPipe(createTodoSchema)) createTodoDto: CreateTodoDto,
  ) {
    try {
      const createdTodo = await this.todoService.create(createTodoDto);
      return mapToGetTodoDto(createdTodo);
    } catch (error) {
      const errorMessage: string = error.message;
      if (errorMessage === LABEL_DOESNT_EXIST_ERROR) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      } else if (errorMessage === LABEL_SERVICE_ERROR) {
        throw new HttpException(errorMessage, HttpStatus.SERVICE_UNAVAILABLE);
      }
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an already existing TODO. If it's updated successfully, it will return a 204 response. Otherwise, it will return an error.
   * @param uuid - uuid - The existing TODO's id
   * @param updateTodoDto - UpdateTodoDto - The new data to be updated
   * @returns 204 (Empty response)
   */
  @Put(':uuid')
  @HttpCode(204)
  async update(
    @Param('uuid', new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(createTodoSchema)) updateTodoDto: UpdateTodoDto,
  ) {
    try {
      await this.todoService.update(id, updateTodoDto);
      return 'Updated successfully';
    } catch (error) {
      const errorMessage: string = error.message;
      if (
        errorMessage === TODO_DOESNT_EXIST_ERROR ||
        errorMessage === LABEL_DOESNT_EXIST_ERROR
      ) {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      } else if (errorMessage === LABEL_SERVICE_ERROR) {
        throw new HttpException(errorMessage, HttpStatus.SERVICE_UNAVAILABLE);
      }
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes an already existing TODO. If it's deleted successfully, it will return a 204 response. Otherwise, it will return an error.
   * @param uuid - uuid - Id of the TODO that should be deleted
   * @returns 204 (Empty response)
   */
  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    try {
      await this.todoService.delete(id);
      return 'Deleted successfully';
    } catch (error) {
      if (error.message === TODO_DOESNT_EXIST_ERROR) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
