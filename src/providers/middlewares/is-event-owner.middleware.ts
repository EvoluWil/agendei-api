import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IsEventOwner implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: any) {
    const { id } = req.params;
    const user = plainToClass(UserAuth, req.user);

    const userIsInEvent = await this.prisma.event.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });
    if (!userIsInEvent && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }

    return next();
  }
}
