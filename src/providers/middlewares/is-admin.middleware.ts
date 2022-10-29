import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';

@Injectable()
export class IsAdmin implements NestMiddleware {
  async use(req: Request, _res: Response, next: any) {
    const user = plainToClass(UserAuth, req.user);

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }

    return next();
  }
}
