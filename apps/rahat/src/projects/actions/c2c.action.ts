// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { BeneficiaryJobs, MS_ACTIONS, ProjectJobs } from '@rahataid/sdk'
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types'

export const c2cActions: ProjectActionFunc = {
  // [MS_ACTIONS.SETTINGS.LIST]: (uuid, payload, sendCommand) =>
  //   sendCommand({ cmd: ProjectJobs.PROJECT_SETTINGS_LIST, uuid }, {}),
  // [MS_ACTIONS.SETTINGS.GET]: (uuid, payload, sendCommand) =>
  //   sendCommand(
  //     { cmd: ProjectJobs.PROJECT_SETTINGS_GET, uuid },
  //     payload
  //   ),

  [MS_ACTIONS.C2CProject.LIST_BEN_COUNT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.LIST_BENEFICIARY_COUNT, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.GET_ALL_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.LIST_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.GET_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.LISTONE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.CREATE_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.CREATE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.UPDATE_DISBURSEMENT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.UPDATE_DISBURSEMENT, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.GET_DISBURSEMENT_TRANSACTIONS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.GET_DISBURSEMENT_TRANSACTIONS, uuid },
      payload,

    ),

  [MS_ACTIONS.C2CProject.GET_DISBURESEMENT_APPROVALS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.GET_DISBURSEMENT_APPROVALS, uuid },
      payload,
      500000
    ),

  [MS_ACTIONS.C2CProject.CREATE_SAFE_TRANSACTION]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.CREATE_SAFE_TRANSACTION, uuid },
      payload,
      500000
    ),

  [MS_ACTIONS.C2CProject.GET_SAFE_TRANSACTION]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.GET_SAFE_TRANSACTION, uuid },
      payload,
      500000
    ),

  [MS_ACTIONS.C2CProject.GET_SAFE_PENDING]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.GET_SAFE_PENDING, uuid },
      payload,
      500000
    ),



  //campaign start
  [MS_ACTIONS.C2CProject.CREATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_ALL_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.LIST_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.FINDONE_CAMPAIGN, uuid },
      payload
    ),

  [MS_ACTIONS.C2CProject.GET_ALL_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_AUDIENCE, uuid },
      payload
    ),


  [MS_ACTIONS.C2CProject.CREATE_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_AUDIENCE, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.TRIGGER_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.TRIGGER_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_ALL_COMMUNICATION_LOGS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_LOGS, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_ALL_COMMUNICATION_STATS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_STATS, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_ALL_TRANSPORT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_TRANSPORT, uuid },
      payload
    ),
  [MS_ACTIONS.C2CProject.GET_CAMPAIGN_LOG]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.CAMPAIGN.GET_CAMPAIGN_LOG, uuid }, payload),
  //campaign end


  // **** Beneficiary Groups **** //
  [MS_ACTIONS.C2CProject.ADD_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.ADD_GROUP, uuid }, payload),

  [MS_ACTIONS.C2CProject.GET_ALL_GROUPS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ALL_GROUPS, uuid }, payload),

  [MS_ACTIONS.C2CProject.GET_ONE_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY.GET_ONE_GROUP, uuid }, payload),

  [MS_ACTIONS.C2CProject.LIST_REPORTING]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.REPORTING.LIST, uuid }, payload),
}
