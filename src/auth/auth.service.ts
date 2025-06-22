import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import {
  AuthenticatedUser,
  JwtPayload,
  LoginUser,
} from './interfaces/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      this.logger.warn(`Login failed: user not found - ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.logger.warn(`Login failed: incorrect password - ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, username: user.username };
  }

  async login(dto: LoginUserDto): Promise<LoginUser> {
    const user: AuthenticatedUser = await this.validateUser(
      dto.username,
      dto.password,
    );

    const payload: JwtPayload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    this.logger.log(`Login successful for user: ${user.username}`);

    return {
      token,
      expiresIn: '1h',
    };
  }
}
