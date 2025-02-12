import { ApiProperty } from '@nestjs/swagger';
import { Beneficiary, Enums, TPIIData } from '@rahataid/sdk';
import {
  ArrayNotEmpty,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { UUID, randomUUID } from 'crypto';

export class CreateBeneficiaryDto implements Beneficiary {
  @ApiProperty({
    example: randomUUID().toString(),
    description: 'Beneficiary ID',
  })
  @IsString()
  @IsOptional()
  uuid?: UUID;

  @ApiProperty({
    example: '1997-03-08',
    description: 'Date of birth in the YYYY-MM-DD format.',
  })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({
    example: '20',
    description: 'Age of the beneficiary.',
  })
  @IsNumber()
  @IsOptional()
  age?: number;


  @ApiProperty({
    type: 'string',
    example: Enums.Gender.FEMALE,
    description: 'Gender ',
  })
  @IsString()
  @IsOptional()
  gender?: Enums.Gender;

  @ApiProperty({
    type: 'string',
    example: 'lalitpur',
    description: 'location of the beneficiary',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    type: 'number',
    example: '26.24',
    description: 'Latitude of community',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    type: 'number',
    example: '86.24',
    description: 'longitude of community',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    type: 'string',
    example: '9785623749',
    description: 'Notes to remember',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    description: 'Ethereum address',
  })
  @IsOptional()
  // @IsEthereumAddress({
  //  always: false,
  // })
  walletAddress: string;

  @ApiProperty({
    format: 'json',
    description: 'Additional JSON data',
    required: false,
    example: {
      hasCitizenship: true,
      passportNumber: '1234567',
      email: 'test@mailinator.com'
    },
  })
  @IsOptional()
  extras?: any;

  @ApiProperty({
    type: 'string',
    example: 'BANKED',
    description: 'beneficiary bankin access',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Enums.BankedStatus)
  bankedStatus?: Enums.BankedStatus;

  @ApiProperty({
    type: 'string',
    example: 'HOME_INTERNET',
    description: 'Beneficiary internet access',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Enums.InternetStatus)
  internetStatus?: Enums.InternetStatus;

  @ApiProperty({
    type: 'string',
    example: 'FEATURE_PHONE',
    description: 'Beneficiary phone ownership',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Enums.PhoneStatus)
  phoneStatus?: Enums.PhoneStatus;

  @ApiProperty({
    format: 'json',
    description: 'Optional PII data for specific use cases',
    required: false,
    example: {
      name: 'Ram Shrestha',
      phone: '98670023857',
      extras: {
        bank: 'Laxmi Bank',
        account: '9872200001',
      },
    },
  })
  @IsOptional()
  piiData: TPIIData;

  @ApiProperty({
    example: [randomUUID().toString()],
    description: 'Array of project UUIDs',
  })
  @IsOptional()
  @ArrayNotEmpty()

  projectUUIDs?: string[];
}
