import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ChangeGrievanceStatusDTO, CreateGrievanceDTO, ListGrievanceDTO } from "@rahataid/extensions";
import { ACTIONS, APP } from "@rahataid/sdk";
import { AbilitiesGuard, CheckAbilities, JwtGuard, SUBJECTS } from "@rumsan/user";
import { GrievanceService } from "./grievance.service";


@Controller('grievances')
@ApiTags('Grievances')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class GrievanceController {

  constructor(
    private readonly grievanceService: GrievanceService
  ) { }


  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('')
  // @ApiOkResponse({ type: createGrivenceResponseDTO })
  create(
    @Body() createGrievanceDto: CreateGrievanceDTO,
    @Request() req: any

  ) {
    const id = req.user.id;
    console.log('req.user', req.user)
    return this.grievanceService.createGrievance(createGrievanceDto, id)
  }

  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })

  @Get('')
  async findAll(
    @Query() query: ListGrievanceDTO
  ) {

    return this.grievanceService.findAll(query);
  }


  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Patch(':uuid/change-status')
  async changeStatus(
    @Param('uuid') uuid: string,
    @Body() data: ChangeGrievanceStatusDTO
  ) {
    return this.grievanceService.changeStatus(uuid, data);
  }

  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Delete(':uuid')
  async softDelete(
    @Param('uuid') uuid: string
  ) {
    return this.grievanceService.softDelete(uuid);
  }

}
