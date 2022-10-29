import { Body, Controller, Param, Get, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserAuth } from 'src/utils/decorators/dto/user.auth.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBadRequestResponse({ description: 'Email e senha não combinam' })
  @Post('/sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiUnauthorizedResponse({ description: 'Acesso não autorizado' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Get('/get-me')
  getMe(@AuthUser() authUser: UserAuth) {
    return this.authService.getMe(authUser);
  }

  @ApiBadRequestResponse({ description: 'Senha antiga invalida' })
  @ApiBadRequestResponse({ description: 'Senha e Confirmação não combinam' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Put('/update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, updatePasswordDto);
  }

  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @Put('/reset-password/:id')
  resetPassword(@Param('id') id: string) {
    return this.authService.resetPassword(id);
  }
}
