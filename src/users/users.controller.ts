import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cria um novo usuário com username, senha e data de nascimento',
  })
  async signup(@Body() dto: CreateUserDto): Promise<{ id: string }> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Lista todos os usuários cadastrados (requer autenticação)',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }
}
