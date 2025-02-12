import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";


export class ProviderActionDto {
    @ApiPropertyOptional({
        example: '0fe88e42-fd5b-4b65-bcbb-9039340f4759',
        description: 'UUID of the offramp provider'
    })
    @IsString()
    uuid: string;

    @ApiPropertyOptional({
        example: 'create-fiat-wallet',
        description: 'Action to be performed on the offramp provider'
    })
    @IsString()
    action: string;

    @ApiPropertyOptional({
        example: {
            "country_code": "KE",
            "phone_number": "+254722154745 ",
            "network": "AIRTEL",
            "account_name": "rumsan-tester"
        },
        description: 'Payload to be sent to the offramp provider'
    })
    @IsObject()
    @IsOptional()
    payload: any;

}
