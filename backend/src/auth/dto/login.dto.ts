import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'razzak172758@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin1234' })
  @IsString()
  @MinLength(6)
  password: string;
}
