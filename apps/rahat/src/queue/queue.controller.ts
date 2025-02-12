import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobStatus } from "bull";
import { UUID } from "crypto";
import { QueueService } from "./queue.service";

@Controller('queue')
@ApiTags('Queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService
  ) { }

  // Contract Jobs with Filters
  @Get('contract-jobs')
  @ApiOperation({ summary: 'Get Pending Contract Jobs with Filters' })
  @ApiResponse({ status: 200, description: 'List of filtered contract jobs' })
  @ApiQuery({ name: 'status', required: false, enum: ['waiting', 'active', 'completed', 'failed', 'delayed'], description: 'Filter by job status' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by job name (e.g., rahat.jobs.beneficiary.bulk_assign_vouchers)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by job creation start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by job creation end date (YYYY-MM-DD)' })
  async getPendingContractJobs(
    @Query('status') status?: string[],
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      status: status as JobStatus[],
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.queueService.getPendingContractJobs(filters);
  }

  @Get('contract-jobs/retry/:id')
  @ApiOperation({ summary: 'Retry a Failed Contract Job' })
  @ApiParam({ name: 'id', description: 'Job ID to retry' })
  async retryContractJob(@Param('id', ParseIntPipe) jobId: string | number | UUID) {
    return this.queueService.retryContractJob(jobId);
  }

  // Rahat Jobs with Filters
  @Get('rahat-jobs')
  @ApiOperation({ summary: 'Get Pending Rahat Jobs with Filters' })
  @ApiResponse({ status: 200, description: 'List of filtered Rahat jobs' })
  @ApiQuery({ name: 'status', required: false, enum: ['waiting', 'active', 'completed', 'failed', 'delayed'], description: 'Filter by job status' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by job name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by job creation start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by job creation end date (YYYY-MM-DD)' })
  async getPendingRahatJobs(
    @Query('status') status?: string[],
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      status: status as JobStatus[],
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.queueService.getPendingRahatJobs(filters);
  }

  @Get('rahat-jobs/retry/:id')
  @ApiOperation({ summary: 'Retry a Failed Rahat Job' })
  @ApiParam({ name: 'id', description: 'Job ID to retry' })
  async retryRahatJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.queueService.retryRahatJob(jobId);
  }

  // Rahat Beneficiary Jobs with Filters
  @Get('rahat-beneficiary-jobs')
  @ApiOperation({ summary: 'Get Pending Rahat Beneficiary Jobs with Filters' })
  @ApiResponse({ status: 200, description: 'List of filtered Rahat Beneficiary jobs' })
  @ApiQuery({ name: 'status', required: false, enum: ['waiting', 'active', 'completed', 'failed', 'delayed'], description: 'Filter by job status' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by job name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by job creation start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by job creation end date (YYYY-MM-DD)' })
  async getPendingRahatBeneficiaryJobs(
    @Query('status') status?: string[],
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      status: status as JobStatus[],
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.queueService.getPendingRahatBeneficiaryJobs(filters);
  }

  @Get('rahat-beneficiary-jobs/retry/:id')
  @ApiOperation({ summary: 'Retry a Failed Rahat Beneficiary Job' })
  @ApiParam({ name: 'id', description: 'Job ID to retry' })
  async retryRahatBeneficiaryJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.queueService.retryRahatBeneficiaryJob(jobId);
  }

  // Meta Transaction Jobs with Filters
  @Get('meta-txn-jobs')
  @ApiOperation({ summary: 'Get Pending Meta Transaction Jobs with Filters' })
  @ApiResponse({ status: 200, description: 'List of filtered Meta Transaction jobs' })
  @ApiQuery({ name: 'status', required: false, enum: ['waiting', 'active', 'completed', 'failed', 'delayed'], description: 'Filter by job status' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by job name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by job creation start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by job creation end date (YYYY-MM-DD)' })
  async getPendingMetaTxnJobs(
    @Query('status') status?: string[],
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const filters = {
      status: status as JobStatus[],
      name,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.queueService.getPendingMetaTxnJobs(filters);
  }

  @Get('meta-txn-jobs/retry/:id')
  @ApiOperation({ summary: 'Retry a Failed Meta Transaction Job' })
  @ApiParam({ name: 'id', description: 'Job ID to retry' })
  async retryMetaTxnJob(@Param('id', ParseIntPipe) jobId: number) {
    return this.queueService.retryMetaTxnJob(jobId);
  }
}
