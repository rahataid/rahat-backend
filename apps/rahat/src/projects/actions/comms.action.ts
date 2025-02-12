import { MS_ACTIONS, ProjectJobs } from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';

export const commsActions: ProjectActionFunc = {
  //campaign start
  [MS_ACTIONS.COMMS.CREATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.CREATE_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.COMMS.UPDATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.UPDATE_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ALL_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.LIST_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.FINDONE_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ALL_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_ALL_AUDIENCE, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ALL_TRANSPORT]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_ALL_TRANSPORT, uuid }, payload),

  [MS_ACTIONS.COMMS.CREATE_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.CREATE_AUDIENCE, uuid }, payload),

  [MS_ACTIONS.COMMS.CREATE_BULK_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_BULK_AUDIENCE, uuid },
      payload
    ),

  [MS_ACTIONS.COMMS.TRIGGER_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.TRIGGER_CAMPAIGN, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ALL_COMMUNICATION_LOGS]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_LOGS, uuid },
      payload
    ),
  [MS_ACTIONS.COMMS.GET_ALL_COMMUNICATION_STATS]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_STATS, uuid },
      payload
    ),
  [MS_ACTIONS.COMMS.GET_CAMPAIGN_LOG]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_CAMPAIGN_LOG, uuid }, payload),
  //campaign end

  // **** Beneficiary Groups **** //
  [MS_ACTIONS.COMMS.ADD_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.ADD_GROUP, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ALL_GROUPS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ALL_GROUPS, uuid }, payload),

  [MS_ACTIONS.COMMS.GET_ONE_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ONE_GROUP, uuid }, payload),


  // **** Beneficiary Groups end **** //
};
