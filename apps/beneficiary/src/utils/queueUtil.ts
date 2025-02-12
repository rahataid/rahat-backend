import { Job } from 'bull';

/**
 * Utility function to check the queue state for active and waiting jobs.
 *
 * @param {Job} job - The Bull job object.
 * @param {Logger} logger - Logger to log the messages.
 *
 * @returns {Promise<boolean>} - Returns true if the job can be processed, false if the queue is busy.
 */
export async function canProcessJob(job: Job, logger: any): Promise<boolean> {
    // Check the queue's active and waiting job count
    const activeCount = await job.queue.getActiveCount();
    const waitingCount = await job.queue.getWaitingCount();

    // If there are any active jobs or jobs in the waiting queue
    if (activeCount > 1 || waitingCount > 0) {
        logger.log(
            `Queue is busy. Waiting for other jobs to finish. Active jobs: ${activeCount}, Waiting jobs: ${waitingCount}`
        );
        return false; // Queue is busy, return false
    }

    logger.log(
        `Queue is free. Proceeding with the job ${job.data.batchIndex} of ${job.data.totalBatchesLength} batches.`
    );
    return true; // No other active/waiting jobs, safe to process
}