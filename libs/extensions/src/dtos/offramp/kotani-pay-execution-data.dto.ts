import { ApiProperty } from '@nestjs/swagger';
import { KotaniPayExecutionData } from '@rahataid/sdk';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class MobileMoneyReceiver {
  @ApiProperty({ description: 'The mobile money network provider (e.g., MTN, Airtel)' })
  @IsNotEmpty()
  @IsString()
  networkProvider: string;

  @ApiProperty({ description: 'The phone number of the mobile money receiver' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'The account name of the mobile money receiver' })
  @IsNotEmpty()
  @IsString()
  accountName: string;
}

export class KotaniPayExecutionDto implements KotaniPayExecutionData {
  @ApiProperty({ description: 'Details of the mobile money receiver' })
  @ValidateNested()
  @Type(() => MobileMoneyReceiver)
  mobileMoneyReceiver: MobileMoneyReceiver;

  @ApiProperty({ description: 'The currency used for the transaction (e.g., KES, USD)' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ description: 'The blockchain network (e.g., BASE, ETH)' })
  @IsNotEmpty()
  @IsString()
  chain: string;

  @ApiProperty({ description: 'The token used for the transaction (e.g., USDC, USDT)' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ description: 'The amount of cryptocurrency to be sent' })
  @IsNotEmpty()
  @IsNumber()
  cryptoAmount: number;

  @ApiProperty({ description: 'The sender\'s wallet address' })
  @IsNotEmpty()
  @IsString()
  senderAddress: string;
}
