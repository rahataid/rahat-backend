// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { MS_ACTIONS } from "@rahataid/sdk";

export const userRequiredActions = new Set([
    MS_ACTIONS.AAPROJECT.ACTIVITIES.UPDATE_STATUS,
    MS_ACTIONS.AAPROJECT.TRIGGERS.ACTIVATE,
    MS_ACTIONS.AAPROJECT.DAILY_MONITORING.ADD,
    MS_ACTIONS.AAPROJECT.BENEFICIARY.RESERVE_TOKEN_TO_GROUP,
    MS_ACTIONS.CAMBODIA.CHW.CREATE,
    MS_ACTIONS.CAMBODIA.BENEFICIARY.LEAD_CONVERSION,
    MS_ACTIONS.CAMBODIA.BENEFICIARY.VALIDATE_CONVERSION
    // Add other actions that require user payload here
]);
