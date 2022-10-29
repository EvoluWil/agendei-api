import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuerybuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QuerybuilderService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const { userId, eventId } = createReservationDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Evento não encontrado');
    }

    await this.prisma.reservation.create({
      data: {
        user: {
          connect: { id: userId },
        },
        event: {
          connect: { id: eventId },
        },
      },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('reservation');
    return this.prisma.reservation.findMany(query);
  }

  async findOne(id: string) {
    const query = await this.qb.query('reservation');
    return await this.prisma.reservation.findFirst({
      ...query,
      where: { id },
    });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      select: { status: true, userId: true },
    });

    if (!reservation) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (reservation.status !== 'PENDING') {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }

    await this.prisma.reservation.update({
      where: { id },
      data: updateReservationDto,
    });

    return { ok: true };
  }

  async remove(id: string, authUser: UserAuth) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (reservation.userId !== authUser.id) {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }

    await this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELED' },
    });

    return { ok: true };
  }
}
