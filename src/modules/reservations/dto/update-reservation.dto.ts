import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReservationDto {
  @ApiProperty({ description: 'Novo status da reserva' })
  @IsString()
  @IsNotEmpty()
  status: 'REJECTED' | 'APPROVED';
}
