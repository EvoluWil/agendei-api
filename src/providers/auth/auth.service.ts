import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { enumUserRoles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from 'src/modules/users/dto/find-user.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { defaultPlainToClass } from 'src/utils/functions/default-plain-class.function';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(id: string, email: string, role: enumUserRoles) {
    const payload = { id, email, role };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email e senha não combinam');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new BadRequestException('Email e senha não combinam');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    return { user: defaultPlainToClass(FindUserDto, user), token };
  }

  async getMe(authUser: UserAuth) {
    const user = await this.prisma.user.findFirst({
      where: { id: authUser.id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user?.password ? { ...user, password: null } : user;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword } = updatePasswordDto;
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const passwordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatched) {
      throw new BadRequestException('Senha antiga invalida');
    }

    const password = await bcrypt.hash(updatePasswordDto.password, 10);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: { password },
    });

    return { ok: true };
  }

  async resetPassword(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const password = await bcrypt.hash(user.email, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: { password },
    });

    return { password: user.email };
  }
}
