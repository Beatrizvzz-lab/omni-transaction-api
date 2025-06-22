import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUser } from './interfaces/auth.types';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autentica um usuário e retorna o token JWT',
    description:
      'Retorna um JWT válido por 1 hora, que deve ser usado nas rotas protegidas com Bearer Token.',
  })
  async signin(@Body() dto: LoginUserDto): Promise<LoginUser> {
    return this.authService.login(dto);
  }
}
