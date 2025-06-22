import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async transfer(dto: TransferDto): Promise<void> {
    const { fromId, toId, amount } = dto;

    if (fromId === toId) {
      this.logger.warn(`Transfer attempt to same user: ${fromId}`);
      throw new BadRequestException(
        'Sender and receiver must be different users.',
      );
    }

    const sender = await this.userRepository.findOneBy({ id: fromId });
    const receiver = await this.userRepository.findOneBy({ id: toId });

    if (!sender || !receiver) {
      this.logger.warn(
        `Transfer failed: User(s) not found. fromId=${fromId}, toId=${toId}`,
      );
      throw new NotFoundException('One or both users not found.');
    }

    if (Number(sender.balance) < amount) {
      this.logger.warn(
        `Transfer failed: Insufficient balance. fromId=${fromId},
         balance=${sender.balance}, amount=${amount}`,
      );
      throw new BadRequestException('Insufficient balance.');
    }

    try {
      await this.dataSource.transaction(async (manager) => {
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

        this.logger.log(
          `Transaction completed: ${fromId} -> ${toId}, amount: ${amount}`,
        );
      });
    } catch (err) {
      this.logger.error(
        `Unexpected error during transaction: fromId=${fromId}, toId=${toId}, amount=${amount}`,
        err,
      );
      throw new BadRequestException('Transaction failed. Try again later.');
    }
  }
}
