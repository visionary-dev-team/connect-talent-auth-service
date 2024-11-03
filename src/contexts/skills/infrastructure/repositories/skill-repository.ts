import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from 'src/contexts/shared/dependency-injection/injectable';
import { FindOneOptions, Repository } from 'typeorm';
import { ISkillRepository } from '../../domain/repositories/skill.repository.interface';
import { Skill } from '../entities/skill-orm.entity';

@Injectable()
export class TypeOrmSkillRepository implements ISkillRepository {
  constructor(
    @InjectRepository(Skill)
    private readonly userRepository: Repository<Skill>
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<Skill | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<Skill>): Promise<Skill> {
    console.log("🚀 ~ file: skill-repository.ts:23 ~ TypeOrmSkillRepository ~ create ~ user:", user)
    const newSkill = await this.userRepository.save({ ...user });

    return newSkill;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async findOne(options: FindOneOptions<Skill>): Promise<Skill | null> {
    return this.userRepository.findOne(options);
  }
  assignUserSkill(userId: number, skillId: number) {
    console.log(2);
  }
}
