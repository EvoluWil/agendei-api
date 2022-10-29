import {
  ExecutionContext,
  createParamDecorator,
  ForbiddenException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserAuth } from './dto/user.auth.dto';

export const IsRequestedUser = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { id } = request.params;
    const user = plainToClass(UserAuth, request.user);

    if (user.id !== id) {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }
  },
);
