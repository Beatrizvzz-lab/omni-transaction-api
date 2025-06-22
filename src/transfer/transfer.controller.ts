import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransferService } from './transfer.service';
import { TransferDto } from './dto/transfer.dto';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transfer')
@ApiBearerAuth('JWT-auth')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Realiza uma transferência entre dois usuários (requer autenticação)',
    description:
      'O usuário autenticado só pode transferir valores a partir do seu próprio ' +
      'ID. A transferência atualiza os saldos e registra uma transação.',
  })
  async transfer(@Req() req: Request, @Body() dto: TransferDto): Promise<void> {
    const user = req.user as { id: string };
    if (dto.fromId !== user.id) {
      throw new ForbiddenException(
        'You can only transfer from your own account',
      );
    }

    await this.transferService.transfer(dto);
  }
}
