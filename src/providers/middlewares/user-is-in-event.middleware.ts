import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserIsInEvent implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: any) {
    const { eventId } = req.params;
    const user = plainToClass(UserAuth, req.user);

    const userIsInEvent = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        OR: [
          {
            ownerId: user.id,
          },
          {
            reservations: { some: { userId: user.id, status: 'APPROVED' } },
          },
        ],
      },
    });
    if (!userIsInEvent && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Usuário sem autorização para visualizar este evento',
      );
    }

    return next();
  }
}
