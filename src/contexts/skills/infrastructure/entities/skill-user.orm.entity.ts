import { User } from 'src/contexts/users/infrastructure/repositories/user.orm-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Skill } from './skill-orm.entity';


@Entity('user_skills')
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.skills, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.users, { nullable: false })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @Column({ type: 'varchar', length: 50 })
  level: string;

  @Column({ type: 'int' })
  yearsOfExperience: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
