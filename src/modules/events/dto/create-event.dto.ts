import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsNumber()
  @IsOptional()
  value: number;

  @IsString()
  @IsOptional()
  limit: number;

  @IsUrl()
  @IsOptional()
  picture: string;
}
