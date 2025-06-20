// src/transfer/transfer.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async transfer(dto: TransferDto): Promise<void> {
    const { fromId, toId, amount } = dto;

    if (fromId === toId) {
      throw new BadRequestException(
        'Sender and receiver must be different users.',
      );
    }

    const sender = await this.userRepository.findOneBy({ id: fromId });
    const receiver = await this.userRepository.findOneBy({ id: toId });

    if (!sender || !receiver) {
      throw new NotFoundException('One or both users not found.');
    }

    if (Number(sender.balance) < amount) {
      throw new BadRequestException('Insufficient balance.');
    }

    await this.dataSource.transaction(async (manager) => {
      sender.balance = Number(sender.balance) - amount;
      receiver.balance = Number(receiver.balance) + amount;

      await manager.save(sender);
      await manager.save(receiver);
    });
  }
}
