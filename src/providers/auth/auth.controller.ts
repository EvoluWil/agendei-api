import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiBadRequestResponse({ description: 'Senha antiga invalida' })
  @ApiBadRequestResponse({ description: 'Senha e Confirmação não combinam' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiForbiddenResponse({
    description: 'Usuário sem autorização para realizar esta ação',
  })
  @Put('/update-password/:id')
  async updatePassword(
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
  async resetPassword(@Param('id') id: string) {
    return this.authService.resetPassword(id);
  }
}
