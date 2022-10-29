import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBadRequestResponse({
    description: 'Este email já está sendo utilizado por outro usuário',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: UserAuth,
  ) {
    return this.usersService.update(id, updateUserDto, authUser);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() authUser: UserAuth) {
    return this.usersService.remove(id, authUser);
  }
}
