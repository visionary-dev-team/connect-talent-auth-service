import { Injectable } from '@nestjs/common';
import { IUserService } from '../../domain/services/user.service.interface';
import { User } from '../repositories/user.orm-entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { FindOneOptions } from 'typeorm';

export class UserServiceDelete implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneById(id);
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, isDeleted: false } });
  }
  async validateUserCredentials(
    options: FindOneOptions<User>
  ): Promise<User | null> {
    return await this.userRepository.findOne(options);
  }
}
