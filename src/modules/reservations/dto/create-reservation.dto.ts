import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: 'Id do usuário' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Id do evento' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
