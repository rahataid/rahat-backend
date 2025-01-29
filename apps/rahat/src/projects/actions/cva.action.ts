// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { MS_ACTIONS, ProjectJobs } from "@rahataid/sdk";
import { ProjectActionFunc } from "@rahataid/sdk/project/project.types";

export const cvaActions: ProjectActionFunc = {

  [MS_ACTIONS.CVAProject.REQUEST_CLAIM]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.REQUEST_CLAIM, uuid },
      payload,
      500000
    ),
  //campaign start
  [MS_ACTIONS.CVAProject.CREATE_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.GET_ALL_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.LIST_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.GET_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.FINDONE_CAMPAIGN, uuid },
      payload
    ),

  [MS_ACTIONS.CVAProject.GET_ALL_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_AUDIENCE, uuid },
      payload
    ),


  [MS_ACTIONS.CVAProject.CREATE_AUDIENCE]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.CREATE_AUDIENCE, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.TRIGGER_CAMPAIGN]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.TRIGGER_CAMPAIGN, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.GET_ALL_COMMUNICATION_LOGS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_LOGS, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.GET_ALL_COMMUNICATION_STATS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_COMMUNICATION_STATS, uuid },
      payload
    ),
  [MS_ACTIONS.CVAProject.GET_ALL_TRANSPORT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.CAMPAIGN.GET_ALL_TRANSPORT, uuid },
      payload
    ),
  //campaign end

}
