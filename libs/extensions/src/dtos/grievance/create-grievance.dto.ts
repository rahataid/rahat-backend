import { ApiProperty } from '@nestjs/swagger';
import { Grievance, GrievanceStatus, GrievanceType } from '@rahataid/sdk';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateGrievanceDTO implements Grievance {
  @ApiProperty({
    example: randomUUID().toString(),
    description: 'Id of the project',
  })
  @IsUUID()
  @IsString()
  projectId: string;

  @ApiProperty({
    example: '9841234567',
    description: 'Contact number of the reporter',
  })
  @IsString()
  reporterContact: string;

  @ApiProperty({
    example: 'Grievance title',
    description: 'Title of the grievance',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Grievance description',
    description: 'Description of the grievance',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: GrievanceType.TECHNICAL,
    description: 'Type of grievance',
    enum: GrievanceType,
  })
  @IsEnum(GrievanceType)
  type: GrievanceType;

  @ApiProperty({
    example: GrievanceStatus.NEW,
    description: 'Status of the grievance',
  })
  @IsOptional()
  @IsEnum(GrievanceStatus)
  status: GrievanceStatus;

  @ApiProperty({
    example: "Sarvesh Karki",

  })
  @IsString()
  reportedBy: string;

}

export class createGrivenceResponseDTO {
  @ApiProperty({
    example: randomUUID().toString(),
    description: 'Id of the project',
  })
  @IsUUID()
  @IsString()
  projectId: string;

}
