import { IsUUID, IsString, IsDateString, IsNumber } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsDateString()
  birthdate: string;

  @IsNumber()
  balance: number;
}
