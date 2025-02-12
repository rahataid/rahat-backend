import { ApiProperty } from '@nestjs/swagger';
import { OfframpProvider } from '@rahataid/sdk';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

type kotanipayConfig = {
    baseUrl: string;
    apiKey: string;
}

type unLimitConfig = {
    baseUrl: string;
    apiKey: string;
    projectId: string;
}

export class CreateOfframpProviderDto implements OfframpProvider<kotanipayConfig | unLimitConfig> {

    @ApiProperty({
        example: 'Kotani Pay',
        description: 'Name of the offramp provider',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: {
            baseUrl: 'https://sandbox-api.kotanipay.io/api/v3',
            apiKey: 'kee',
        },
        description: 'Configuration of the offramp provider',
    })
    @IsNotEmpty()
    @IsObject()
    config: kotanipayConfig | unLimitConfig;

    @ApiProperty({
        example: 'Kotani Pay is a payment gateway',
        description: 'Description of the offramp provider',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: {
            fee: 0.1,
            supportedCurrency: ['KES', 'USD'],
        },
        description: 'Extra information about the offramp provider',
    })
    @IsOptional()
    @IsObject()
    extras?: any;


}
