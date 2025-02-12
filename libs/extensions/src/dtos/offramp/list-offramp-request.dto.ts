import { IsInt, IsOptional, Min } from 'class-validator';

export class ListOfframpRequestDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    perPage?: number;
}
