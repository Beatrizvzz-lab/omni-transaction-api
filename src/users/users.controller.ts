import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<{ id: string }> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request): Promise<UserResponseDto[]> {
    console.log('Usuário autenticado:', req.user);
    return this.usersService.findAll();
  }
}
