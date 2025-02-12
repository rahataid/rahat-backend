import { MS_ACTIONS, ProjectJobs } from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';

export const rpActions: ProjectActionFunc = {
  [MS_ACTIONS.RPPROJECT.GET_ALL_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.LIST_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.FINDONE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.CREATE_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.CREATE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.UPDATE_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.UPDATE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_ALL_DISBURSEMENT_PLAN]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.LIST_DISBURSEMENT_PLAN, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_DISBURSEMENT_PLAN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.FINDONE_DISBURSEMENT_PLAN, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.CREATE_DISBURSEMENT_PLAN]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.CREATE_DISBURSEMENT_PLAN, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.UPDATE_DISBURSEMENT_PLAN]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.UPDATE_DISBURSEMENT_PLAN, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.CREATE_BULK_DISBURSEMENT]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.DISBURSEMENT_PLAN.BULK_CREATE_DISBURSEMENT, uuid },
      payload
    ),
  //campaign start
  [MS_ACTIONS.RPPROJECT.CREATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.CREATE_CAMPAIGN, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.UPDATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.UPDATE_CAMPAIGN, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.GET_ALL_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.LIST_CAMPAIGN, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.GET_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.FINDONE_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.GET_ALL_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_ALL_AUDIENCE, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.GET_ALL_TRANSPORT]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_ALL_TRANSPORT, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.CREATE_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.CREATE_AUDIENCE, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.CREATE_BULK_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_BULK_AUDIENCE, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.TRIGGER_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.TRIGGER_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.GET_ALL_COMMUNICATION_LOGS]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_LOGS, uuid },
      payload
    ),
  [MS_ACTIONS.RPPROJECT.GET_ALL_COMMUNICATION_STATS]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_STATS, uuid },
      payload
    ),
  [MS_ACTIONS.RPPROJECT.GET_CAMPAIGN_LOG]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_CAMPAIGN_LOG, uuid }, payload),
  //campaign end

  //redemption start
  [MS_ACTIONS.RPPROJECT.REQUEST_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.REQUEST_REDEMPTION, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.UPDATE_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.UPDATE_REDEMPTION, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.LIST_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.LIST_REDEMPTION, uuid }, payload),
  [MS_ACTIONS.RPPROJECT.GET_VENDOR_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.GET_VENDOR_REDEMPTION, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.SYNC_OFFLINE_BENEFICIARIES]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES.SYNC_BENEFICIARIES,
        uuid,
      },
      payload,
      5000
    ),
  [MS_ACTIONS.RPPROJECT.GET_OFFLINE_BENEFICIARIES]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES.GET_SYNCED_BENEFICIARIES,
        uuid,
      },
      payload,
      5000
    ),

  [MS_ACTIONS.RPPROJECT.GET_OFFLINE_VENDORS]: (uuid, payload, sendCommand) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES.GET_OFFLINE_VENDORS,
        uuid,
      },
      payload,
      5000
    ),
  [MS_ACTIONS.RPPROJECT.GET_OFFLINE_SINGLE_VENDOR]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES.GET_OFFLINE_SINGLE_VENDOR,
        uuid,
      },
      payload,
      5000
    ),

  [MS_ACTIONS.RPPROJECT.SAVE_SYNCED_BENEFICIARIES_TO_VENDOR]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES
          .SAVE_SYNCED_BENEFICIARIES_TO_VENDOR,
        uuid,
      },
      payload,
      5000
    ),
  [MS_ACTIONS.RPPROJECT.GET_BENEFICIARIES_DISBURSEMENTS]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.BENEFICIARY.GET_BENEFICIARIES_DISBURSEMENTS, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_UNSYNCED_BENEFICIARIES]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      {
        cmd: ProjectJobs.BENEFICIARY.GET_UNSYNCED_BENEFICIARIES,
        uuid,
      },
      payload,
      5000
    ),

  // **** Beneficiary Groups **** //
  [MS_ACTIONS.RPPROJECT.ADD_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.ADD_GROUP, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.GET_ALL_GROUPS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ALL_GROUPS, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.GET_ONE_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ONE_GROUP, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.UPDATE_OFFLINE]: (uuid, payload, sendCommand) =>
    sendCommand(
      {
        cmd: ProjectJobs.OFFLINE_BENEFICIARIES.UPDATE_OFFLINE_BENEFICIARY,
        uuid,
      },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_UNSYNCED_BENEFICIARY_GROUP]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.BENEFICIARY.GET_UNSYNCED_BENEFICIARY_GROUP, uuid },
      payload
    ),

  // **** Beneficiary Groups end **** //

  // TODO Move to kenya specific actions

  // Walkin Beneficiary
  [MS_ACTIONS.RPPROJECT.CREATE_WALKIN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.BENEFICIARY.CREATE_WALKIN_BENEFICIARY, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_WALKIN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.BENEFICIARY.GET_WALKIN_BENEFICIARY, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.GET_ALL_WALKIN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.BENEFICIARY.GET_ALL_WALKIN_BENEFICIARY, uuid },
      payload
    ),

  [MS_ACTIONS.RPPROJECT.CREATE_BULK_WALKIN_BENEFICIARIES]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.CREATE_BULK_WALKIN_BENEFICIARY, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.SYNC_OFFLINE_TRANSACTIONS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.SYNC_OFFLINE_TRANSACTIONS, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.LIST_REPORTING]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.REPORTING.LIST, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.GET_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.GET_REDEMPTION, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.UPDATE_BENEFICIARY]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.UPDATE_BENEFICIARY_REDEMPTION, uuid }, payload),

  [MS_ACTIONS.RPPROJECT.LIST_BENEFICIARY_REIMBURSEMENTS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.LIST_BENEFICIARY_REIMBURSEMENTS, uuid }, payload),
};
