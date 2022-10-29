import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: 'Nome do evento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Data e hora de início do evento' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'Data e hora do fim do evento' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Descrição do evento' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Local do evento' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Estado do evento' })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ description: 'Cidade do evento' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ description: 'Bairro do evento' })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({ description: 'Preço de entrada ao evento (0 para gratuito)' })
  @IsNumber()
  @IsOptional()
  value: number;

  @ApiProperty({ description: 'Limite de pessoas no evento' })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({ description: 'Url de imagem do evento' })
  @IsUrl()
  @IsOptional()
  picture: string;
}
