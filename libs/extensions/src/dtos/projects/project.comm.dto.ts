import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class ProjectCommunicationDto {
  @ApiProperty({ example: 'beneficiary.create', type: 'string' })
  @IsString()
  action: string;

  @ApiProperty({ example: { name: 'John Doe' }, type: 'object' })
  @IsObject()
  payload: any;

  @ApiProperty({ example: { event_name: 'redeem.voucher' }, type: 'object' })
  @IsObject()
  @IsOptional()
  trigger: any
}
