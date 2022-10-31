import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Events')
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiBadRequestResponse({ description: 'já existe um evento com esse nome' })
  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @AuthUser() authUser: UserAuth,
  ) {
    return this.eventsService.create(createEventDto, authUser);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findOne(slug);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
