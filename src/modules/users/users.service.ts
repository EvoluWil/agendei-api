import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { QuerybuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QuerybuilderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    const alreadyExists = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (alreadyExists) {
      throw new BadRequestException(
        'Email já está sendo utilizado por outro usuário',
      );
    }

    const hashPassword = await hash(password, 10);

    await this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword, email },
    });

    return { ok: true };
  }

  async findAll() {
    const query = await this.qb.query('user');
    const users = await this.prisma.user.findMany(query);

    return users.map((user) =>
      user?.password ? { ...user, password: null } : user,
    );
  }

  async findInEvents(eventId: string) {
    const query = await this.qb.query('user');
    const users = await this.prisma.user.findMany({
      ...query,
      where: { reservations: { some: { id: eventId } } },
    });

    return users.map((user) =>
      user?.password ? { ...user, password: null } : user,
    );
  }

  async findOne(id: string) {
    const query = await this.qb.query('user');
    const user = await this.prisma.user.findFirst({ ...query, where: { id } });
    return user?.password ? { ...user, password: null } : user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (id === 'logadoUserId') {
      throw new ForbiddenException(
        'Usuário sem autorização para realizar esta ação',
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({ where: { id } });

    return { ok: true };
  }
}
