// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

import {
  BeneficiaryJobs,
  MS_ACTIONS,
  ProjectJobs,
  VendorJobs
} from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';

export const elActions: ProjectActionFunc = {

  [MS_ACTIONS.ELPROJECT.UPDATE_STATUS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.REDEEM_VOUCHER, uuid },
      payload),

  [MS_ACTIONS.ELPROJECT.REQUEST_REDEMPTION_BE]: async (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.REQUEST_REDEMPTION, uuid },
      payload,
      500000
    ),

  [MS_ACTIONS.ELPROJECT.UPDATE_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.UPDATE_REDEMPTION, uuid },
      payload,
      500000
    ),
  [MS_ACTIONS.ELPROJECT.LIST_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.LIST_REDEMPTION, uuid },
      payload,
      500000
    ),
  [MS_ACTIONS.ELPROJECT.GET_VENDOR_REDEMPTION]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.GET_VENDOR_REDEMPTION, uuid },
      payload,
      500000
    ),

  [MS_ACTIONS.ELPROJECT.LIST_BEN_VENDOR_COUNT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.LIST_BEN_VENDOR_COUNT },
      { projectId: uuid },
      500000
    ),

  [MS_ACTIONS.ELPROJECT.GET_ALL_STATS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.GET_ALL_STATS, uuid },
      500000
    ),

  [MS_ACTIONS.ELPROJECT.GET_VENDOR_STATS]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: VendorJobs.GET_VENDOR_STATS }, { projectId: uuid },
      500000
    ),
};
