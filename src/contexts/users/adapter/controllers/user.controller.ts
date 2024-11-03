import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ValidRoles } from 'src/contexts/shared/auth/models/valid-roles.enum';
import { User } from '../../domain/entities/user.entityy';
import { ResponseCreateUserDto } from '../dtos/response-create-user.dto';
import { AssignSkillsDto } from '../dtos/assign-skill.dto';
import { JwtAuthGuard } from 'src/contexts/shared/auth/guard/jwt-auth-guard';
import { CurrentUser } from 'src/contexts/shared/decorators/current-user.decorator';
import { AssignSkillUserUseCase } from 'src/contexts/skills/application/assign-skill-user.use-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly assignSkillUseCase: AssignSkillUserUseCase
  ) {}

  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): Promise<User | null> {
  //   return this.userService.findOne(+id);
  // }

  @Post('collaborator')
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<ResponseCreateUserDto> {
    console.log('🚀 ~ UserController ~ create ~ createUserDto:', createUserDto);
    return await this.createUserUseCase.execute({
      ...createUserDto,
      role: ValidRoles.COLLABORATOR,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign-skills')
  async assignSkills(
    @CurrentUser() user: User,
    @Body() assignSkillsDto: AssignSkillsDto
  ) {
    try {
      console.log(
        '🚀 ~ file: user.controller.ts:55 ~ UserController ~ assignSkillsDto:',
        assignSkillsDto
      );
      console.log(
        '🚀 ~ file: user.controller.ts:55 ~ UserController ~ user:',
        user
      );
      console.log(
        '🚀 ~ file: user.controller.ts:51 ~ UserController ~ user:',
        1
      );

      await this.assignSkillUseCase.execute({
        userId: user.id,
        skills: assignSkillsDto.skillIds,
      });
    } catch (err) {
      throw err;
    }
  }
  // @Delete(':id')
  // delete(@Param('id') id: number): Promise<void> {
  //   return this.createUseCase.delete(+id);
  // }
}
