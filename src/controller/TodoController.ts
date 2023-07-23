import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { GetTodoDto } from 'src/dto/GetTodoDto';
import { CreateTodoDto } from 'src/dto/CreateTodoDto';
import { UpdateTodoDto } from 'src/dto/UpdateTodoDto';
import { mapToGetTodoDto, mapToGetTodoDtoList } from './util/ControllerUtils';
import { ITodoService } from 'src/service/ITodoService';
import { JoiValidationPipe } from './util/JoiValidationPipe';
import { createTodoSchema } from './util/ValidationPipe';
import { TODO } from 'src/types/todo';

@Controller('todo')
export class TodoController {
  constructor(private todoService: ITodoService) {}

  /**
   * Gets all the TODOs in the database
   * @returns GetTodoDto[]
   */
  @Get()
  async findAll(): Promise<GetTodoDto[]> {
    const todoList: TODO[] = await this.todoService.findAll();
    return mapToGetTodoDtoList(todoList);
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
    const todo: TODO = await this.todoService.findById(id);
    return mapToGetTodoDto(todo);
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
    const createdTodo = await this.todoService.create(createTodoDto);
    return mapToGetTodoDto(createdTodo);
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
    await this.todoService.update(id, updateTodoDto);
    return 'Updated successfully';
  }

  /**
   * Deletes an already existing TODO. If it's deleted successfully, it will return a 204 response. Otherwise, it will return an error.
   * @param uuid - uuid - Id of the TODO that should be deleted
   * @returns 204 (Empty response)
   */
  @Delete(':uuid')
  @HttpCode(204)
  async remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    await this.todoService.delete(id);
    return 'Deleted successfully';
  }
}
