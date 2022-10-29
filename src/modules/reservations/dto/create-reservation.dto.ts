import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
