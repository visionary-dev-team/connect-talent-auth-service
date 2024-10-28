import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ValidRoles } from 'src/contexts/shared/auth/models/valid-roles.enum';
import { User } from '../../domain/entities/user.entityy';
import { ResponseCreateUserDto } from '../dtos/response-create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): Promise<User | null> {
  //   return this.userService.findOne(+id);
  // }

  @Post('collaborator')
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseCreateUserDto> {
    console.log("🚀 ~ UserController ~ create ~ createUserDto:", createUserDto)
    
    return this.createUserUseCase.execute({
      ...createUserDto,
      role: ValidRoles.COLLABORATOR,
    });
  }

  // @Delete(':id')
  // delete(@Param('id') id: number): Promise<void> {
  //   return this.createUseCase.delete(+id);
  // }
}
