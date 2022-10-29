import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Reservations')
@Controller({ path: 'reservations', version: '1' })
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @AuthUser() authUser: UserAuth,
  ) {
    return this.reservationsService.update(id, updateReservationDto, authUser);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Evento não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: UserAuth) {
    return this.reservationsService.remove(id, authUser);
  }
}
