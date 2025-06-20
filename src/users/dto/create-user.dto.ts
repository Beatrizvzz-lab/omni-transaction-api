import { IsString, IsDateString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  birthdate: string;
}
