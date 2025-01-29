// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  AddBenToProjectDto,
  CreateBeneficiaryDto,
  CreateBeneficiaryGroupsDto,
  ImportTempBenefDto,
  ListBeneficiaryDto,
  ListBeneficiaryGroupDto,
  ListTempBeneficiariesDto,
  ListTempGroupsDto,
  UpdateBeneficiaryDto,
  UpdateBeneficiaryGroupDto,
  ValidateWalletDto,
} from '@rahataid/extensions';
import {
  APP,
  BeneficiaryJobs,
  BQUEUE,
  Enums,
  MS_TIMEOUT,
  TFile,
} from '@rahataid/sdk';
import {
  AbilitiesGuard,
  ACTIONS,
  CheckAbilities,
  JwtGuard,
  SUBJECTS,
} from '@rumsan/user';
import { Queue } from 'bull';
import { UUID } from 'crypto';
import { catchError, throwError, timeout } from 'rxjs';
import { CheckHeaders, ExternalAppGuard } from '../decorators';
import { removeSpaces } from '../utils';
import { handleMicroserviceCall } from '../utils/handleMicroserviceCall';
import { trimNonAlphaNumericValue } from '../utils/sanitize-data';
import { DocParser } from './parser';

function getDateInfo(dateString) {
  try {
    // const [day, month, year] = dateString.split("/");
    const date = new Date(dateString);
    return {
      date: date.toISOString(),
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      age: new Date().getFullYear() - date.getFullYear(),
      isAdult: new Date().getFullYear() - date.getFullYear() > 18,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

@Controller('beneficiaries')
@ApiTags('Beneficiaries')
export class BeneficiaryController {
  constructor(
    @Inject('BEN_CLIENT') private readonly client: ClientProxy,
    @InjectQueue(BQUEUE.RAHAT) private readonly queue: Queue
  ) { }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get()
  async list(@Query() dto: ListBeneficiaryDto) {
    return this.client.send({ cmd: BeneficiaryJobs.LIST }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('temp/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async listTempBenef(
    @Param('uuid') uuid: UUID,
    @Query() query: ListTempBeneficiariesDto
  ) {
    return this.client.send(
      { cmd: BeneficiaryJobs.LIST_TEMP_BENEFICIARY },
      { uuid, query }
    );
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('temp-groups')
  async listTempGroups(@Query() query: ListTempGroupsDto) {
    return this.client.send({ cmd: BeneficiaryJobs.LIST_TEMP_GROUPS }, query);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('pii')
  async listPiiData(@Query() dto: any) {
    return this.client.send({ cmd: BeneficiaryJobs.LIST_PII }, dto);
  }

  // @ApiBearerAuth(APP.JWT_BEARER)
  // @UseGuards(JwtGuard, AbilitiesGuard)
  // @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('stats')
  async getStats() {
    return this.client.send({ cmd: BeneficiaryJobs.STATS }, {});
  }

  // @ApiBearerAuth(APP.JWT_BEARER)
  // @UseGuards(JwtGuard, AbilitiesGuard)
  @Get('statsSource')
  async getStatsSource() {
    return this.client.send({ cmd: BeneficiaryJobs.GET_ALL_STATS }, {});
  }

  // @ApiBearerAuth(APP.JWT_BEARER)
  // @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('table-stats')
  async getTableStats() {
    return this.client.send({ cmd: BeneficiaryJobs.GET_TABLE_STATS }, {});
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post()
  async create(@Body() dto: CreateBeneficiaryDto) {
    return this.client.send({ cmd: BeneficiaryJobs.CREATE }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.USER })
  @ApiParam({ name: 'uuid', required: true })
  @Post('projects/:uuid')
  async referBeneficiary(
    @Param('uuid') uuid: UUID,
    @Body() dto: AddBenToProjectDto
  ) {
    return this.client.send(
      { cmd: BeneficiaryJobs.ADD_TO_PROJECT },
      { dto, projectUid: uuid }
    );
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('bulk')
  async createBulk(@Body() dto: CreateBeneficiaryDto[]) {
    const data = dto.map((b) => ({
      ...b,
      birthDate: b.birthDate ? new Date(b.birthDate).toISOString() : null,
    }));

    return this.client
      .send({ cmd: BeneficiaryJobs.CREATE_BULK }, data)
      .pipe(timeout(MS_TIMEOUT));
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: TFile, @Req() req: Request) {
    const docType: Enums.UploadFileType =
      req.body['doctype']?.toUpperCase() || Enums.UploadFileType.JSON;
    const projectId = req.body['projectId'];
    const beneficiaries = await DocParser(docType, file.buffer);
    const beneficiariesMapped = beneficiaries.map((b) => ({
      birthDate: b['Birth Date']
        ? new Date(b['Birth Date']).toISOString()
        : null,
      internetStatus: b['Internet Status*'],
      bankedStatus: b['Bank Status*'],
      location: b['Location'],
      phoneStatus: b['Phone Status*'],
      notes: b['Notes'],
      gender: b['Gender*'],
      latitude: b['Latitude'],
      longitude: b['Longitude'],
      age: b['Age'] || null,
      walletAddress: b['Wallet Address'],
      piiData: {
        name: b['Name*'] || 'Unknown',
        phone: b['Whatsapp Number*'] || b['Phone Number*'],
        extras: {
          isAdult:
            getDateInfo(b['Birth Date'])?.isAdult || Number(b['Age*']) > 18,
          governmentId: b['Government ID'],
        },
      },
    }));

    return this.client
      .send(
        { cmd: BeneficiaryJobs.CREATE_BULK },
        { data: beneficiariesMapped, projectUUID: projectId }
      )
      .pipe(
        catchError((error) => {
          console.log('error', error);
          return throwError(() => new BadRequestException(error.message));
        })
      )
      .pipe(timeout(MS_TIMEOUT));
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('upload-queue')
  @UseInterceptors(FileInterceptor('file'))
  async uploadWithQueue(@UploadedFile() file: TFile, @Req() req: Request) {
    const docType: Enums.UploadFileType =
      req.body['doctype']?.toUpperCase() || Enums.UploadFileType.JSON;
    const projectId = req.body['projectId'];
    const automatedGroupOption = req.body['automatedGroupOption'];
    automatedGroupOption.createAutomatedGroup = JSON.parse(
      automatedGroupOption.createAutomatedGroup
    );
    console.log(automatedGroupOption);
    const beneficiaries = await DocParser(docType, file.buffer);


    // Utility function to sanitize input keys by trimming whitespace
    function sanitizeKey(key: string): string {
      return key.trim();
    }

    const beneficiariesWithSanitizedKeys = beneficiaries.map((b) => {
      const sanitizedBeneficiary = {};
      for (const key in b) {
        sanitizedBeneficiary[sanitizeKey(key)] = b[key];
      }
      return sanitizedBeneficiary;
    }
    );


    // Map the beneficiaries to the format expected by the microservice


    const beneficiariesMapped = beneficiariesWithSanitizedKeys.map((b) => ({
      birthDate: b[sanitizeKey('Birth Date')]
        ? new Date(b[sanitizeKey('Birth Date')]).toISOString()
        : null,
      internetStatus: b[sanitizeKey('Internet Status*')],
      bankedStatus: b[sanitizeKey('Bank Status*')],
      location: trimNonAlphaNumericValue(b[sanitizeKey('Location')]),
      phoneStatus: b[sanitizeKey('Phone Status*')],
      notes: b[sanitizeKey('Notes')],
      gender: b[sanitizeKey('Gender*')] || b[sanitizeKey('Gender')],
      latitude: b[sanitizeKey('Latitude')],
      longitude: b[sanitizeKey('Longitude')],
      age: b[sanitizeKey('Age')] || null,
      walletAddress: b[sanitizeKey('Wallet Address')],
      piiData: {
        name: b[sanitizeKey('Name*')] || b[sanitizeKey('Beneficiary Name')] || 'Unknown',
        phone: removeSpaces(
          b[sanitizeKey('Whatsapp Number*')] ||
          b[sanitizeKey('Phone Number*')] ||
          b[sanitizeKey('Phone Number')] ||
          b[sanitizeKey('Beneficiary Phone Number')] ||
          b[sanitizeKey('Phone number')]
        ),
      },
      extras: {
        healthWorker: b[sanitizeKey('Health Worker Username')] || "Unknown",
        type: b[sanitizeKey('Type')] || null,
        phone: removeSpaces(
          b[sanitizeKey('Phone Number*')] ||
          b[sanitizeKey('Beneficiary Phone Number')] ||
          b[sanitizeKey('Phone number')] || null
        ),
        visionCenter: b[sanitizeKey('Vision Center Name')] || null,
        reasonForLead: b[sanitizeKey('Reason For Lead')] || null,
        village: b[sanitizeKey('Village')] || null,
        commune: b[sanitizeKey('Commune')] || null,
        district: b[sanitizeKey('District')] || null,
        province: b[sanitizeKey('Province')] || null,
        occupation: b[sanitizeKey('Occupation')] || null,
      },
    }));


    const uniquePhoneNumberedBeneficiaries = beneficiariesMapped.filter(
      (b, index, self) =>
        index ===
        self.findIndex(
          (t) => t.piiData.phone === b.piiData.phone
        )
    );

    // uniquePhoneNumberedBeneficiaries.forEach((beneficiary) => {
    //   console.log(beneficiary, beneficiary.piiData.extras);
    // });
    // return "sda"


    console.log(`Trying to upload ${beneficiariesMapped.length} beneficiaries through queue. Unique phone numbers: ${uniquePhoneNumberedBeneficiaries.length}, Duplicate phone numbers: ${beneficiariesMapped.length - uniquePhoneNumberedBeneficiaries.length}`);

    return handleMicroserviceCall({
      client: this.client.send(
        { cmd: BeneficiaryJobs.IMPORT_BENEFICIARY_LARGE_QUEUE },
        {
          data: uniquePhoneNumberedBeneficiaries,
          projectUUID: projectId,
          ignoreExisting: true,
          automatedGroupOption,
        }
      ),
      onError(error) {
        console.log('error', error);
        return throwError(() => new BadRequestException(error.message));
      },
      onSuccess(response) {
        // console.log('response', response)
        return response;
      },
    });

    // return this.client
    //   .send({ cmd: BeneficiaryJobs.IMPORT_BENEFICIARY_LARGE_QUEUE }, {
    //     data: beneficiariesMapped, projectUUID: projectId,

    //   })
    //   .pipe(
    //     catchError((error) => {
    //       console.log('error', error);
    //       return throwError(() => new BadRequestException(error.message));
    //     })
    //   )
    //   .pipe(timeout(MS_TIMEOUT)).toPromise()

    // return {
    //   success: true,
    //   message: 'Upload in progress. Will start appearing once completed.'
    // }
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Patch(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  async update(@Param('uuid') uuid: UUID, @Body() dto: UpdateBeneficiaryDto) {
    return this.client.send({ cmd: BeneficiaryJobs.UPDATE }, { uuid, ...dto });
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Patch('remove/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async remove(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.REMOVE }, { uuid });
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Delete(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  async delete(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.DELETE }, { uuid });
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get(':uuid')
  @ApiParam({ name: 'uuid', required: true })
  async getBeneficiary(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.GET }, uuid);
  }

  @Get('wallet/:wallet')
  @ApiParam({ name: 'wallet', required: true })
  async getBeneficiaryByWallet(@Param('wallet') wallet: string) {
    return this.client.send({ cmd: BeneficiaryJobs.GET_BY_WALLET }, wallet);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('phone/:phone')
  @ApiParam({ name: 'phone', required: true })
  async getBeneficiaryByPhone(@Param('phone') phone: string) {
    return this.client.send({ cmd: BeneficiaryJobs.GET_BY_PHONE }, phone);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('verification-link/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async generateVerificationLink(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.GENERATE_LINK }, uuid);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('validate-wallet')
  async validateWallet(@Body() dto: ValidateWalletDto) {
    return this.client.send({ cmd: BeneficiaryJobs.VALIDATE_WALLET }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('verify-signature')
  async verifySignature(@Body() dto: any) {
    return this.client.send({ cmd: BeneficiaryJobs.VERIFY_SIGNATURE }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('groups')
  async createGroup(@Body() dto: CreateBeneficiaryGroupsDto) {
    return this.client.send({ cmd: BeneficiaryJobs.ADD_GROUP }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('groups/all')
  async getAllGroups(@Query() dto: ListBeneficiaryGroupDto) {
    return this.client.send({ cmd: BeneficiaryJobs.GET_ALL_GROUPS }, dto);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Get('groups/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async getOneGroup(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.GET_ONE_GROUP }, uuid);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Delete('groups/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async removeGroup(@Param('uuid') uuid: UUID) {
    return this.client.send({ cmd: BeneficiaryJobs.REMOVE_ONE_GROUP }, uuid);
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Patch('groups/:uuid')
  @ApiParam({ name: 'uuid', required: true })
  async updateGroup(
    @Param('uuid') uuid: UUID,
    @Body() dto: UpdateBeneficiaryGroupDto
  ) {
    return this.client.send(
      { cmd: BeneficiaryJobs.UPDATE_GROUP },
      { uuid, ...dto }
    );
  }

  @Post('import-tools')
  @UseGuards(ExternalAppGuard)
  @CheckHeaders('Signature')
  async importBeneficiariesFromTool(@Req() req: Request) {
    return this.client.send(
      {
        cmd: BeneficiaryJobs.IMPORT_BENEFICIARIES_FROM_COMMUNITY_TOOL,
      },
      req.body
    );
  }

  @ApiBearerAuth(APP.JWT_BEARER)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @Post('import-temp')
  async importTempBeneficiaries(@Body() dto: ImportTempBenefDto) {
    return this.client.send(
      { cmd: BeneficiaryJobs.IMPORT_TEMP_BENEFICIARIES },
      dto
    );
  }
}
