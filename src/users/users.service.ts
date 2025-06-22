import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<{ id: string }> {
    const { username, password, birthdate } = dto;

    const userExists = await this.userRepository.findOneBy({ username });
    if (userExists) {
      this.logger.warn(`Username already taken: ${username}`);
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      birthdate: new Date(birthdate),
    });

    const saved = await this.userRepository.save(user);
    return { id: saved.id };
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      this.logger.warn(`User not found: ${username}`);
    }

    return user ?? undefined;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(({ id, username, birthdate, balance, createdAt }) => ({
      id,
      username,
      balance,
      birthdate: birthdate.toISOString().split('T')[0],
      createdAt: createdAt.toISOString(),
    }));
  }
}
