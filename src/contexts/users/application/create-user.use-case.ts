// contexts/users/application/use-cases/create-user.use-case.ts

import { ValidRoles } from 'src/contexts/shared/auth/models/valid-roles.enum';
import { User } from '../domain/entities/user.entityy';
import * as bcrypt from 'bcrypt';

import {
  IUserRepository,
  IUserRepositoryToken,
} from '../domain/repositories/user.repository';
import { ResponseCreateUserDto } from '../adapter/dtos/response-create-user.dto';
import { BadRequestException, Inject } from '@nestjs/common';

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ValidRoles;
}
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    createUserInput: CreateUserInput
  ): Promise<ResponseCreateUserDto> {
    console.log('🚀 ~ CreateUserUseCase ~ createUserInput:', createUserInput);

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (existingUser) {
      throw new BadRequestException({
        message: 'El correo electrónico ya está en uso',
        field: 'email',
      });
    }

    const user = new User(createUserInput);
    console.log('🚀 ~ CreateUserUseCase ~ User:', User);
    // Validaciones y lógica de negocio
    const newUserRepository = await this.userRepository.create(user);

    console.log('newUserRepository', newUserRepository);
    return {
      user: {
        email: newUserRepository.email,
        id: newUserRepository.id,
        firstName: newUserRepository.firstName,
        lastName: newUserRepository.lastName,
        role: newUserRepository.role,
      },
      tokens: {
        accessToken: '',
        refreshToken: '',
      },
    };
  }
}
