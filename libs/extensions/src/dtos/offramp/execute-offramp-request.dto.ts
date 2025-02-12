import { ApiProperty } from '@nestjs/swagger';
import { ExecuteOfframpRequest } from '@rahataid/sdk';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { KotaniPayExecutionDto } from './kotani-pay-execution-data.dto';

export class ExecuteOfframpRequestDto implements ExecuteOfframpRequest {
    @ApiProperty({ description: 'The UUID of the offramp provider' })
    @IsNotEmpty()
    @IsString()
    providerUuid: string;

    @ApiProperty({ description: 'The UUID of the offramp request' })
    @IsNotEmpty()
    @IsString()
    requestUuid: string;

    @ApiProperty({ description: 'Additional data for the offramp request', type: KotaniPayExecutionDto })
    @IsNotEmpty()
    @IsObject()
    @Type(() => KotaniPayExecutionDto)
    data: KotaniPayExecutionDto;
}
