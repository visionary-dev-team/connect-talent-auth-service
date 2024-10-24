import { Injectable } from '@nestjs/common';
import { UserServiceInterface } from '../../domain/services/user.service.interface';
import { User } from '../../domain/model/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
