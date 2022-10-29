import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuerybuilderService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { normalizeString } from 'src/utils/functions/normalize-string.function';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QuerybuilderService,
  ) {}

  async create(createEventDto: CreateEventDto, authUser: UserAuth) {
    const { name } = createEventDto;
    const alreadyExists = await this.prisma.event.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });

    if (alreadyExists) {
      throw new BadRequestException('já existe um evento com esse nome');
    }

    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        name,
        slug: normalizeString(name),
        owner: { connect: { id: authUser.id } },
      },
    });

    return { id: event.id };
  }

  async findAll() {
    const query = await this.qb.query('event');
    return this.prisma.event.findMany(query);
  }

  async findOne(id: string) {
    const query = await this.qb.query('event');
    return this.prisma.event.findFirst({
      ...query,
      where: { id },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (updateEventDto.name) {
      const alreadyExists = await this.prisma.event.findFirst({
        where: { name: { equals: updateEventDto.name, mode: 'insensitive' } },
        select: { id: true },
      });

      if (alreadyExists) {
        throw new BadRequestException('já existe um evento com esse nome');
      }
    }

    await this.prisma.event.update({
      where: { id },
      data: updateEventDto.name
        ? { ...updateEventDto, slug: normalizeString(updateEventDto.name) }
        : updateEventDto,
    });

    return { ok: true };
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    await this.prisma.event.update({ where: { id }, data: { active: false } });

    return { ok: true };
  }
}
