import { IsUUID, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ example: 'uuid-from' })
  @IsUUID()
  fromId: string;

  @ApiProperty({ example: 'uuid-to' })
  @IsUUID()
  toId: string;

  @ApiProperty({ example: 100 })
  @IsPositive()
  amount: number;
}
