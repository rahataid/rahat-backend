import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";


export class ListOfframpProviderDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  @IsOptional()
  perPage: number;

}
