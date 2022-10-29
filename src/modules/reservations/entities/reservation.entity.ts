import { enumReservationStatus, Reservation } from '@prisma/client';

export class ReservationEntity implements Reservation {
  id: string;
  status: enumReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  userId: string;
  eventId: string;
}
