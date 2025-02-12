import { ApiProperty } from '@nestjs/swagger';
import { OfframpRequest } from '@rahataid/sdk';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateOfframpRequestDto implements OfframpRequest {

    @ApiProperty({
        example: '0fe88e42-fd5b-4b65-bcbb-9039340f4759',
        description: 'UUID of the offramp provider'
    })
    @IsString()
    @IsNotEmpty()
    providerUuid: string;

    @ApiProperty({
        example: 'ethereum',
        description: 'The blockchain network for the offramp request',
    })
    @IsString()
    @IsNotEmpty()
    chain: string;

    @ApiProperty({
        example: 'ETH',
        description: 'The token symbol for the offramp request',
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        example: '1.5',
        description: 'The amount of tokens for the offramp request',
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({
        example: '0x1234567890123456789012345678901234567890',
        description: 'The sender address for the offramp request',
        required: false,
    })
    @IsString()
    senderAddress: string;


}
