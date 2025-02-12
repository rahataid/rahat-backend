import {
  BeneficiaryJobs,
  MS_ACTIONS,
  ProjectJobs,
  VendorJobs
} from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';
export const beneficiaryActions: ProjectActionFunc = {
  [MS_ACTIONS.BENEFICIARY.ADD_TO_PROJECT]: (uuid, payload, sendCommand) => {
    return sendCommand(
      { cmd: BeneficiaryJobs.ADD_TO_PROJECT },
      { dto: payload, projectUid: uuid }
    )
  },
  [MS_ACTIONS.BENEFICIARY.BULK_ADD_TO_PROJECT]: (uuid, payload, sendCommand) => {
    return sendCommand(
      { cmd: BeneficiaryJobs.BULK_ADD_TO_PROJECT },
      { dto: payload, projectUid: uuid }
    )
  },
  [MS_ACTIONS.BENEFICIARY.ASSGIN_TO_PROJECT]: (uuid, payload, sendCommand) => {
    return sendCommand(
      { cmd: BeneficiaryJobs.ASSIGN_TO_PROJECT },
      { projectId: uuid, ...payload } // WHY IS PROJECT ID PASSED HERE? THIS GOES TO BENF MS

    )
  },
  [MS_ACTIONS.BENEFICIARY.ASSGIN_GROUP_TO_PROJECT]: (uuid, payload, sendCommand) => {
    return sendCommand(
      { cmd: BeneficiaryJobs.ASSIGN_GROUP_TO_PROJECT },
      { projectId: uuid, ...payload }

    )
  },
  [MS_ACTIONS.BENEFICIARY.BULK_ASSIGN_TO_PROJECT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.BULK_ASSIGN_TO_PROJECT },
      { projectId: uuid, ...payload }
    ),
  [MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.LIST, uuid },
      { projectId: uuid, ...payload }
    ),
  [MS_ACTIONS.BENEFICIARY.GET_PROJECT_SPECIFIC]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.GET_PROJECT_SPECIFIC },
      { projectId: uuid, ...payload }
    ),
  [MS_ACTIONS.ELPROJECT.GET_VENDOR_REFERRER]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: BeneficiaryJobs.VENDOR_REFERRAL, uuid },
      payload,
      50000
    ),
};

export const vendorActions: ProjectActionFunc = {
  [MS_ACTIONS.VENDOR.ASSIGN_TO_PROJECT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: VendorJobs.ASSIGN_PROJECT },
      { projectId: uuid, ...payload }
    ),
  [MS_ACTIONS.VENDOR.LIST_BY_PROJECT]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: VendorJobs.LIST_BY_PROJECT },
      { projectId: uuid, ...payload }
    ),

  [MS_ACTIONS.VENDOR.GET_BY_UUID]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: VendorJobs.GET_BY_UUID },
      { projectId: uuid, ...payload }
    ),
};

export const settingActions: ProjectActionFunc = {
  [MS_ACTIONS.SETTINGS.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.PROJECT_SETTINGS_LIST, uuid }, payload),

  [MS_ACTIONS.SETTINGS.GET]: (uuid, payload, sendCommand) =>
    sendCommand(
      { cmd: ProjectJobs.PROJECT_SETTINGS_GET, uuid },
      payload
    ),

}

export const projectActions: ProjectActionFunc = {
  [MS_ACTIONS.PROJECT.SETUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.PROJECT_SETUP, uuid }, payload),
  [MS_ACTIONS.PROJECT.REFRESH_REPORTING_STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.REPORTING_REFRESH, uuid }, payload),
};

export const groupActions: ProjectActionFunc = {
  [MS_ACTIONS.GROUP.CREATE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.GROUP.CREATE, uuid }, payload),
  [MS_ACTIONS.GROUP.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.GROUP.LIST, uuid }, payload),
  [MS_ACTIONS.GROUP.GET]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.GROUP.GET, uuid }, payload),
};

export const beneficiaryGroupActions: ProjectActionFunc = {
  [MS_ACTIONS.BENEFICIARY_GROUP.BULK_ASSIGN]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY_GROUP.BULK_ASSIGN, uuid }, payload),
  [MS_ACTIONS.BENEFICIARY_GROUP.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY_GROUP.LIST, uuid }, payload),
  [MS_ACTIONS.BENEFICIARY_GROUP.LIST_BY_GROUP]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: ProjectJobs.BENEFICIARY_GROUP.LIST_BY_GROUP, uuid }, payload),
};


