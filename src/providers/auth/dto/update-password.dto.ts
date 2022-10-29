import { Match } from 'src/utils/decorators/match.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Senha antiga do usuário' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'Nova senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Repita a nova senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;
}
