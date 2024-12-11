import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
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
import { PriorityScheduler } from 'src/contexts/shared/algorith/PriorityScheluder';
import { Logger } from 'src/contexts/shared/logger/domain';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly assignSkillUseCase: AssignSkillUserUseCase,
    private readonly priorityScheduler: PriorityScheduler,
    private readonly logger: Logger


  ) { }

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
      await this.assignSkillUseCase.execute({
        userId: user.id,
        skills: assignSkillsDto.skillIds,
      });
    } catch (err) {
      throw err;
    }
  }
  @Get('verify/:priority')
async verifyTask(@Param('priority') priority: number,
@Body() bodyVerify:BodyVerify) {
  if (priority < 1 || priority > 10) {
    throw new BadRequestException('La prioridad debe estar entre 1 y 10');
  }

  this.logger.info(`Solicitud recibida con prioridad ${priority}`);

  this.priorityScheduler.addTask(priority, async () => {
    this.logger.info(`Procesando tarea con prioridad ${priority}`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula el procesamiento
    console.log('body verify',bodyVerify)
    this.logger.info(`Tarea con prioridad ${priority} completada`);
  });

  return {
    message: 'Solicitud de tarea añadida a la cola con prioridad',
  };
}
@Get('processed-order')
getProcessedOrder() {
  return {
    processedOrder: this.priorityScheduler.getProcessedOrder(),
  };
}

  // @Delete(':id')
  // delete(@Param('id') id: number): Promise<void> {
  //   return this.createUseCase.delete(+id);
  // }
}

type BodyVerify ={
  name:string

}