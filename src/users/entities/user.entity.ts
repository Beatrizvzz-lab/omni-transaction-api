import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  birthdate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1000 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;
}
