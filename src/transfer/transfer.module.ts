import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Transaction])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
