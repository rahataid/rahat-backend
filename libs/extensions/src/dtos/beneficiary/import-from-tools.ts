import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UUID } from "crypto";


export class ImportTempBenefDto {

  @ApiProperty({
    description: 'Group UUID',
    example: '19d4dcfd-8ed9-42c4-b282-4820b79d6330'
  })
  @IsString()
  @IsNotEmpty()
  groupUUID: UUID
}


// Create type enum for the type of import
export enum BeneficiaryType {
  LEAD = "LEAD",
  HOME_VISIT = 'HOME_VISIT',
  SALE = 'SALE',
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  UNKNOWN = "UNKNOWN"
}
export class TestKoboImportDto {
  @ApiProperty({
    description: 'Beneficiary Type',
    example: 'LEAD'
  })
  @IsString()
  @IsNotEmpty()
  type: BeneficiaryType

  @ApiProperty({
    example: 'Ram Shrestha'
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'MALE'
  })
  @IsString()
  @IsNotEmpty()
  gender: GENDER

  @ApiProperty({
    example: "9779800000000"
  })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({
    example: 20
  })
  @IsNumber()
  @IsNotEmpty()
  age: number

  @ApiProperty({
    example: "Lumbini"
  })
  @IsString()
  @IsOptional()
  province?: string

  @ApiProperty({
    example: "Dang"
  })
  @IsString()
  @IsOptional()
  district?: string

  @ApiProperty({
    example: "12"
  })
  @IsString()
  @IsOptional()
  wardNo?: string

  @ApiProperty({
    example: ['Sun Glasses']
  })
  @IsArray()
  @IsOptional()
  leadInterests?: string[]

  @ApiProperty({
    example: {
      "_submitted_by": "kobo_username",
    }
  })
  @IsOptional()
  meta?: object
}
