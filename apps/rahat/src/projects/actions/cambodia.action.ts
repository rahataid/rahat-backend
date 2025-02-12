import { MS_ACTIONS } from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';

export const CAMBODIA_JOBS = {
  APP: {
    STATS: 'rahat.jobs.app.stats',
    LINE_STATS: 'rahat.jobs.app.line_stats',
    BROADCAST_STATUS_COUNT: 'rahat.jobs.app.broadcast_status_count',
    PROJECT_SETTINGS: 'rahat.jobs.app.project_settings',
    TRIGGER_COMMUNICATION: 'rahat.jobs.app.trigger_communication',
  },
  CHW: {
    STATS: 'rahat.jobs.chw.stats',
    CREATE: 'rahat.jobs.chw.create',
    LIST: 'rahat.jobs.chw.list',
    GET: 'rahat.jobs.chw.get',
    UPDATE: 'rahat.jobs.chw.update',
    DELETE: 'rahat.jobs.chw.delete',
    LIST_BY_VENDOR: 'rahat.jobs.chw.list_by_vendor',
    VALIDATE_HEALTH_WORKER: 'rahat.jobs.app.validate_health_worker',
  },
  BENEFICIARY: {
    VALIDATE_CONVERSION: 'rahat.jobs.beneficiary.validate_conversion',
    STATS: 'rahat.jobs.beneficiary.stats',
    CREATE_DISCARDED: 'rahat.jobs.beneficiary.create_discarded',
    CREATE: 'rahat.jobs.beneficiary.create',
    LIST_BY_PROJECT: 'rahat.jobs.beneficiary.list_by_project',
    GET: 'rahat.jobs.beneficiary.get',
    LIST: 'rahat.jobs.beneficiary.list',
    LIST_DISCARDED: 'rahat.jobs.beneficiary.list_discarded',
    LEAD_CONVERSION: 'rahat.jobs.beneficiary.lead_conversion',
  },
  COMMISSION_SCHEME: {
    CREATE: 'rahat.jobs.commission_scheme.create',
    LIST: 'rahat.jobs.commission_scheme.list',
    GET_CURRENT: 'rahat.jobs.commission_scheme.get_current',
  },
  VENDOR: {
    STATS: 'rahat.jobs.vendor.stats',
    CREATE: 'rahat.jobs.vendor.create',
    LIST: 'rahat.jobs.vendor.list',
    LEAD_CONVERSIONS: 'rahat.jobs.vendor.lead_conversions',
    HEALTH_WORKERS: 'rahat.jobs.vendor.health_workers',
    GET: 'rahat.jobs.vendor.get',
    UPDATE: 'rahat.jobs.vendor.update',
    UPDATE_IS_VERIFIED: 'rahat.jobs.vendor.update_is_verified',
    LIST_BY_PROJECT: 'rahat.jobs.vendor.list_by_project',
  },
  COMMUNICATION: {
    LIST: 'rahat.jobs.communication.list',
  }
};

export const cambodiaActions: ProjectActionFunc = {
  [MS_ACTIONS.CAMBODIA.APP.STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.APP.STATS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.VENDOR.HEALTH_WORKERS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.VENDOR.HEALTH_WORKERS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.VENDOR.STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.VENDOR.STATS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.VENDOR.GET]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.VENDOR.GET, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.VENDOR.LEAD_CONVERSIONS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.VENDOR.LEAD_CONVERSIONS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.LEAD_CONVERSION]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: CAMBODIA_JOBS.BENEFICIARY.LEAD_CONVERSION, uuid },
      payload
    ),

  [MS_ACTIONS.CAMBODIA.COMMISISION_SCHEME.CREATE]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand({ cmd: CAMBODIA_JOBS.COMMISSION_SCHEME.CREATE, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.COMMISISION_SCHEME.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.COMMISSION_SCHEME.LIST, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.COMMISISION_SCHEME.GET_CURRENT]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: CAMBODIA_JOBS.COMMISSION_SCHEME.GET_CURRENT, uuid },
      payload
    ),

  [MS_ACTIONS.CAMBODIA.VENDOR.UPDATE_IS_VERIFIED]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: CAMBODIA_JOBS.VENDOR.UPDATE_IS_VERIFIED, uuid },
      payload
    ),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.CREATE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.BENEFICIARY.CREATE, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.BENEFICIARY.STATS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.BENEFICIARY.LIST, uuid }, payload),


  [MS_ACTIONS.CAMBODIA.BENEFICIARY.VALIDATE_CONVERSION]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.BENEFICIARY.VALIDATE_CONVERSION, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.LIST_DISCARDED]: (
    uuid,
    payload,
    sendCommand
  ) =>
    sendCommand(
      { cmd: CAMBODIA_JOBS.BENEFICIARY.LIST_DISCARDED, uuid },
      payload
    ),

  [MS_ACTIONS.CAMBODIA.BENEFICIARY.GET]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.BENEFICIARY.GET, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.CHW.CREATE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.CREATE, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.CHW.STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.STATS, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.CHW.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.LIST, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.CHW.LIST_BY_VENDOR]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.LIST_BY_VENDOR, uuid }, payload),

  [MS_ACTIONS.CAMBODIA.CHW.GET]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.GET, uuid }, payload),
  [MS_ACTIONS.CAMBODIA.CHW.UPDATE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.UPDATE, uuid }, payload),
  [MS_ACTIONS.CAMBODIA.CHW.DELETE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.CHW.DELETE, uuid }, payload),
  [MS_ACTIONS.CAMBODIA.COMMUNICATION.LIST]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.COMMUNICATION.LIST, uuid }, payload),
  [MS_ACTIONS.CAMBODIA.APP.LINE_STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: CAMBODIA_JOBS.APP.LINE_STATS, uuid }, payload),
  [MS_ACTIONS.CAMBODIA.APP.BROAD_CAST_STATUS_COUNT]: (uuid, payload, sendCommand) => {
    console.log(uuid);
    return (

      sendCommand({ cmd: CAMBODIA_JOBS.APP.BROADCAST_STATUS_COUNT, uuid }, payload)
    )
  },
  [MS_ACTIONS.CAMBODIA.APP.PROJECT_SETTINGS]: (uuid, payload, sendCommand) => {
    console.log(uuid);
    return (

      sendCommand({ cmd: CAMBODIA_JOBS.APP.PROJECT_SETTINGS, uuid }, payload)
    )
  },
  [MS_ACTIONS.CAMBODIA.APP.TRIGGER_COMMUNICATION]: (uuid, payload, sendCommand) => {
    console.log(uuid);
    return (

      sendCommand({ cmd: CAMBODIA_JOBS.APP.TRIGGER_COMMUNICATION, uuid }, payload)
    )
  },
  [MS_ACTIONS.CAMBODIA.CHW.VALIDATE_HEALTH_WORKER]: (uuid, payload, sendCommand) => {
    console.log(uuid);
    return (

      sendCommand({ cmd: CAMBODIA_JOBS.CHW.VALIDATE_HEALTH_WORKER, uuid }, payload)
    )
  }
};

