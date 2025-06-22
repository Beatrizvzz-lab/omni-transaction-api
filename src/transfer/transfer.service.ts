import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransferService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      // Atualiza saldo
      sender.balance = Number(sender.balance) - amount;
      receiver.balance = Number(receiver.balance) + amount;

      await manager.save(sender);
      await manager.save(receiver);

      const transaction = manager.create(Transaction, {
        fromId,
        toId,
        amount,
      });

      await manager.save(transaction);
    });
  }
}
