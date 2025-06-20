import { IsUUID, IsString, IsDateString } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsDateString()
  birthdate: string;

  @IsString()
  balance: number;
}
