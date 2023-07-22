import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTodoDto } from 'src/dto/CreateTodoDto';
import { UpdateTodoDto } from 'src/dto/UpdateTodoDto';

@Controller('todo')
export class TodoController {
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return 'This action adds a new TODO';
  }

  @Get()
  findAll() {
    return `This action returns all TODOs`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} TODO`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} TODO`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} TODO`;
  }
}
