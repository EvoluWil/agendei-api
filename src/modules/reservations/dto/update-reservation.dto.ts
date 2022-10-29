import { enumReservationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateReservationDto {
  @IsString()
  @IsEnum(enumReservationStatus)
  @IsNotEmpty()
  status: enumReservationStatus;
}
