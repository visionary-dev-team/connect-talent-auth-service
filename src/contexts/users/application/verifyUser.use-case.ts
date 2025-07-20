import { BadRequestException, Inject } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../domain/repositories/user.repository.interface';
import { User } from '../infrastructure/entities/user.orm-entity';
import { PriorityScheduler } from 'src/contexts/shared/algorith/PriorityScheluder';
import { Logger } from 'src/contexts/shared/logger/domain';
import { Profile } from 'src/contexts/profile/infrastructure/repositories/profile.orm-entity';




type BodyVerify = {
  name: string
  userId: number

}

export class VerifyUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly priorityScheduler: PriorityScheduler<BodyVerify>,
    private readonly logger: Logger,


  ) { }
  async execute(userId: number) {
    console.log("🚀 ~ file: verifyUser.use-case.ts:28 ~ VerifyUserUseCase ~ execute ~ userId:", userId)


    const existUser = await this.userRepository.findOneById(userId);

    console.log("🚀 ~ file: verifyUser.use-case.ts:31 ~ VerifyUserUseCase ~ execute ~ existUser:", (existUser.profile as Profile)?.firstName)
    const bodyVerify: BodyVerify = {
      name: (existUser.profile as Profile)?.firstName + ' ' + ((existUser.profile as Profile)?.lastName ?? ''),
      userId: existUser.id,
    }
    console.log("🚀 ~ file: verifyUser.use-case.ts:38 ~ VerifyUserUseCase ~ execute ~ bodyVerify:", bodyVerify)
    const priority = existUser.priorityLevel;

    if (priority < 1 || priority > 10) {
      throw new BadRequestException('La prioridad debe estar entre 1 y 10');
    }

    this.logger.info(`Solicitud recibida con prioridad ${priority}`);


    this.priorityScheduler.addTask(priority, bodyVerify, async () => {
      this.logger.info(`Procesando tarea con prioridad ${priority}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula el procesamiento


      console.log("mensaje", bodyVerify)

     const result = await this.userRepository.updateVerify(bodyVerify.userId);
     console.log("🚀 ~ file: verifyUser.use-case.ts:58 ~ VerifyUserUseCase ~ this.priorityScheduler.addTask ~ result:", result)
     
      this.logger.info(`Tarea con prioridad ${priority} completada`);
    });

    return {
      message: 'Solicitud de tarea añadida a la cola con prioridad',
    };
  }
}
