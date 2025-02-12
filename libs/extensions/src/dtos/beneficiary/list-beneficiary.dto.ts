import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { PaginationDto } from '@rumsan/extensions/dtos';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListBeneficiaryDto {
  // @IsIn(['createdAt', 'updatedAt', 'fullName', 'gender'])
  // override sort = 'createdAt';

  // override order: 'asc' | 'desc' = 'desc';

  @ApiProperty({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiProperty({ example: 'desc' })
  @IsString()
  @IsOptional()
  order: 'asc' | 'desc';

  @ApiProperty({ example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ example: '10' })
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({ example: 'd8f61ebb-ae83-4a8b-8f36-ed756aa27d12' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ example: 'MALE' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 'REFERRED' })
  @IsString()
  @IsOptional()
  type?: string;


  @ApiPropertyOptional({ example: '2024-06-25T18:15:00.000Z' })
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-06-25T18:15:00.000Z' })
  @IsOptional()
  endDate?: string;
}

export class ListProjectBeneficiaryDto {

  @ApiProperty({ example: "ENROLLED" })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiProperty({ example: "ENROLLED" })
  @IsString()
  @IsOptional()
  order: 'asc' | 'desc';

  @ApiProperty({ example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  perPage: number;

  @ApiProperty({ example: "ENROLLED" })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ example: "NOT_ASSIGNED" })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({ example: 'd8f61ebb-ae83-4a8b-8f36-ed756aa27d12' })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}


export class ListTempGroupsDto {
  @ApiProperty({ example: 'desc' })
  @IsString()
  @IsOptional()
  order: 'asc' | 'desc';

  @ApiProperty({ example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ example: '10' })
  @IsNumber()
  perPage: number;

  @ApiPropertyOptional({ example: 'Demo' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class ListTempBeneficiariesDto {
  @ApiProperty({ example: 'desc' })
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @ApiProperty({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: '10' })
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional({ example: 'Demo' })
  @IsString()
  @IsOptional()
  firstName?: string;
}
