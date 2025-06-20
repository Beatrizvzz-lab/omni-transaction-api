// src/transfer/transfer.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async transfer(@Body() dto: TransferDto): Promise<void> {
    await this.transferService.transfer(dto);
  }
}
