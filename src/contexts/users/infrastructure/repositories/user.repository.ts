import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './user.orm-entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.save(user);
    const data = await this.userRepository.find();
    console.log('🚀 ~ TypeOrmUserRepository ~ create ~ data:', data);
    console.log('🚀 ~ TypeOrmUserRepository ~ create ~ newUser:', newUser);

    // return this.userRepository.create(newUser);
    return newUser;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }
}
