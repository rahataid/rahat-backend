import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class ListGrievanceDTO {
  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiPropertyOptional({ example: 'asc' })
  @IsString()
  @IsOptional()
  order: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({ example: 'd8f61ebb-ae83-4a8b-8f36-ed756aa27d12' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 'title' })
  @IsString()
  @IsOptional()
  title?: string;


}
