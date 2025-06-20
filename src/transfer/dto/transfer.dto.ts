// src/transfer/dto/transfer.dto.ts
import { IsUUID, IsPositive } from 'class-validator';

export class TransferDto {
  @IsUUID()
  fromId: string;

  @IsUUID()
  toId: string;

  @IsPositive()
  amount: number;
}
