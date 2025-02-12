import { RabbitMQModuleOptions } from '@rumsan/rabbitmq';

export const APP_JOBS = {
  EMAIL: 'email',
  SLACK: 'slack',
  OTP: 'otp',
};

export const MS_TIMEOUT = 500000;

export const BQUEUE = {
  RAHAT: 'RAHAT',
  RAHAT_PROJECT: 'RAHAT.PROJECT',
  RAHAT_BENEFICIARY: 'RAHAT.BENEFICIARY',
  HOST: 'RAHAT.HOST',
  META_TXN: 'RAHAT.META_TXN'
};

export const UserRoles = {
  ADMIN: 'Admin',
  USER: 'User',
  VENDOR: 'Vendor',
};

export const ACTIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
};

export const SUBJECTS = {
  ALL: 'all',
  BENEFICIARY: 'beneficiary',
  PROJECT: 'project',
  VENDOR: 'vendor',
  PUBLIC: 'public',
};

export const APP = {
  JWT_BEARER: 'JWT',
};

export const MS_ACTIONS = {
  GROUP: {
    CREATE: 'group.create',
    LIST: 'group.list',
    GET: 'group.get'
  },
  BENEFICIARY_GROUP: {
    BULK_ASSIGN: 'beneficiary_group.bulk_assign',
    LIST: 'beneficiary_group.list',
    LIST_BY_GROUP: 'beneficiary_group.list_by_group',
  }
  ,
  CAMBODIA: {
    APP: { STATS: 'cambodia.app.stats', LINE_STATS: 'cambodia.app.line_stats', BROAD_CAST_STATUS_COUNT: 'cambodia.app.broadcast_status_count', PROJECT_SETTINGS: 'cambodia.app.project_settings', TRIGGER_COMMUNICATION: 'cambodia.app.trigger_communication', },
    BENEFICIARY: {
      VALIDATE_CONVERSION: 'cambodia.beneficiary.validate_conversion',
      STATS: 'cambodia.beneficiary.stats',
      LEAD_CONVERSION: 'cambodia.beneficiary.lead_conversion',
      CREATE: 'cambodia.beneficiary.create',
      LIST: 'cambodia.beneficiary.list',
      LIST_DISCARDED: 'cambodia.beneficiary.list_discarded',
      GET: 'cambodia.beneficiary.get',
      DELETE: 'cambodia.beneficiary.delete',
      ADD_TO_PROJECT: 'cambodia.beneficiary.add_to_project',
    },
    CHW: {
      STATS: 'cambodia.chw.stats',
      CREATE: 'cambodia.chw.create',
      LIST: 'cambodia.chw.list',
      GET: 'cambodia.chw.get',
      UPDATE: 'cambodia.chw.update',
      DELETE: 'cambodia.chw.delete',
      LIST_BY_VENDOR: 'cambodia.chw.list_by_vendor',
      VALIDATE_HEALTH_WORKER: 'cambodia.chw.validate_health_worker',
    },
    COMMISISION_SCHEME: {
      CREATE: 'cambodia.commission_scheme.create',
      LIST: 'cambodia.commission_scheme.list',
      GET_CURRENT: 'cambodia.commission_scheme.get_current',
    },
    VENDOR: {
      STATS: 'cambodia.vendor.stats',
      HEALTH_WORKERS: 'cambodia.vendor.health_workers',
      LEAD_CONVERSIONS: 'cambodia.vendor.lead_conversions',
      LIST: 'cambodia.vendor.list',
      GET: 'cambodia.vendor.get',
      UPDATE_IS_VERIFIED: 'cambodia.vendor.update_is_verified',
      ASSIGN_TO_PROJECT: 'cambodia.vendor.assign_to_project',
    },

    COMMUNICATION: {
      LIST: 'cambodia.communication.list',
    }
  },

  PROJECT: {
    SETUP: 'project.setup',
    REFRESH_REPORTING_STATS: 'project.refresh_reporting_stats',
  },
  BENEFICIARY: {
    CREATE: 'beneficiary.create',
    LIST: 'beneficiary.list',
    GET: 'beneficiary.get',
    DELETE: 'beneficiary.delete',
    ADD_TO_PROJECT: 'beneficiary.add_to_project',
    BULK_ADD_TO_PROJECT: 'beneficiary.bulk_add_to_project',
    ASSGIN_TO_PROJECT: 'beneficiary.assign_to_project',
    ASSGIN_GROUP_TO_PROJECT: 'beneficiary.assign_group_to_project',
    BULK_ASSIGN_TO_PROJECT: 'beneficiary.bulk_assign',
    LIST_BY_PROJECT: 'beneficiary.list_by_project',
    GET_PROJECT_SPECIFIC: 'beneficiary.project_specific',
  },
  VENDOR: {
    REGISTER: 'vendor.register',
    ASSIGN_TO_PROJECT: 'vendor.assign_to_project',
    LIST_BY_PROJECT: 'vendor.list_by_project',
    UPDATE_IS_VERIFIED: 'vendor.update_is_verified',
    LIST: 'vendor.list',
    GET_BY_UUID: 'vendor.get_by_uuid',
  },
  USER: {},
  ELPROJECT: {
    REDEEM_VOUCHER: 'elProject.redeemVoucher',
    UPDATE_STATUS: 'elProject.updateStatus',
    PROCESS_OTP: 'elProject.processOtp',
    SEND_SUCCESS_MESSAGE: 'elProject.successMessage',
    ASSIGN_DISCOUNT_VOUCHER: 'elProject.discountVoucher',
    REQUEST_REDEMPTION: 'elProject.requestRedemption',
    REQUEST_REDEMPTION_BE: 'elProject.requestRedemption_be',
    UPDATE_REDEMPTION: 'elProject.updateRedemption',
    LIST_REDEMPTION: 'elProject.listRedemption',
    GET_VENDOR_REDEMPTION: 'elProject.vendorRedemption',
    GET_VENDOR_REFERRER: 'elProject.beneficiaryReferred',
    GET_ALL_STATS: 'elProject.getAllStats',
    LIST_BEN_VENDOR_COUNT: 'elProject.count_ben_vendor',
    GET_VENDOR_STATS: 'elProject.getVendorStats',
  },
  SETTINGS: {
    LIST: 'settings.list',
    GET: 'settings.get',
    ADD: 'settings.add',
  },
  AAPROJECT: {
    RIVER_STATIONS: {
      GET_DHM: 'aaProject.riverStations.getDhm',
    },
    WATER_LEVELS: {
      GET_DHM: 'aaProject.waterLevels.getDhm',
      GET_GLOFAS: 'aaProject.waterLevels.getGlofas',
    },
    TRIGGERS: {
      DEV_ONLY: 'aaProject.triggers.devOnly',
      GET_ALL: 'aaProject.triggers.getAll',
      GET_ONE: 'aaProject.triggers.getOne',
      ADD: 'aaProject.triggers.add',
      REMOVE: 'aaProject.triggers.remove',
      ACTIVATE: 'aaProject.triggers.activate',
    },
    ACTIVITIES: {
      GET_ONE: 'aaProject.activities.getOne',
      GET_ALL: 'aaProject.activities.getAll',
      GET_HAVING_COMMS: 'aaProject.activities.getHavingComms',
      ADD: 'aaProject.activities.add',
      REMOVE: 'aaProject.activities.remove',
      UPDATE: 'aaProject.activities.update',
      UPDATE_STATUS: 'aaProject.activities.updateStatus',
      COMMUNICATION: {
        TRIGGER: 'aaProject.activities.communication.trigger',
        SESSION_LOGS: 'aa.activities.communication.sessionLogs',
        RETRY_FAILED: 'aa.activities.communication.retryFailed',
        GET_STATS: 'aa.activities.communication.getStats',
      },
    },
    ACTIVITY_CATEGORIES: {
      GET_ALL: 'aaProject.activityCategories.getAll',
      ADD: 'aaProject.activityCategories.add',
      REMOVE: 'aaProject.activityCategories.remove',
    },
    HAZARD_TYPES: {
      GET_ALL: 'aaProject.hazardTypes.getAll',
    },
    PHASES: {
      GET_ONE: 'aaProject.phases.getOne',
      GET_ALL: 'aaProject.phases.getAll',
      GET_STATS: 'aaProject.phases.getStats',
      ADD_TRIGGERS: 'aaProject.phases.addTriggers',
      REVERT_PHASE: 'aaProject.phases.revertPhase',
    },
    STAKEHOLDERS: {
      GET_ALL: 'aaProject.stakeholders.getAll',
      ADD: 'aaProject.stakeholders.add',
      REMOVE: 'aaProject.stakeholders.remove',
      UPDATE: 'aaProject.stakeholders.update',
      GET_GROUP: 'aaProject.stakeholders.getGroup',
      GET_ALL_GROUPS: 'aaProject.stakeholders.getAllGroups',
      GET_ONE_GROUP: 'aaProject.stakeholders.getOneGroup',
      ADD_GROUP: 'aaProject.stakeholders.addGroup',
      UPDATE_GROUP: 'aaProject.stakeholders.updateGroup',
      DELETE_GROUP: 'aaProject.stakeholders.deleteGroup',
    },
    CONTRACT: {
      INCREASE_BUDEGET: 'aaProject.contract.increase_budget',
    },
    BENEFICIARY: {
      ADD_GROUP: 'aaProject.beneficiary.addGroup',
      GET_ALL_GROUPS: 'aaProject.beneficiary.getAllGroups',
      GET_ONE_GROUP: 'aaProject.beneficiary.getOneGroup',
      ASSIGN_TOKEN_TO_GROUP: 'aaProject.beneficiary.assign_token_to_group',
      RESERVE_TOKEN_TO_GROUP: 'aaProject.beneficiary.reserve_token_to_group',
      GET_ALL_TOKEN_RESERVATION:
        'aaProject.beneficiary.get_all_token_reservation',
      GET_ONE_TOKEN_RESERVATION:
        'aaProject.beneficiary.get_one_token_reservation',
      GET_RESERVATION_STATS: 'aaProject.beneficiary.get_reservation_stats',
    },
    STATS: {
      GET_ALL: 'aaProject.stats.getAll',
      GET_ONE: 'aaProject.stats.getOne',
    },
    DAILY_MONITORING: {
      ADD: 'aaProject.dailyMonitoring.add',
      GET_ALL: 'aaProject.dailyMonitoring.getAll',
      GET_ONE: 'aaProject.dailyMonitoring.getOne',
      UPDATE: 'aaProject.dailyMonitoring.update',
      REMOVE: 'aaProject.dailyMonitoring.remove',
    },
  },
  C2CProject: {
    UPDATE_STATUS: 'c2cProject.updateStatus',
    LIST_BEN_COUNT: 'c2cProject.count_ben',
    CREATE_DISBURSEMENT: 'c2cProject.disbursement.create',
    GET_ALL_DISBURSEMENT: 'c2cProject.disbursements.get',
    GET_DISBURSEMENT: 'c2cProject.disbursement.getOne',
    GET_DISBURSEMENT_TRANSACTIONS: 'c2cProject.disbursement.transactions.get',
    GET_DISBURESEMENT_APPROVALS: 'c2cProject.disbursement.approvals.get',
    UPDATE_DISBURSEMENT: 'c2cProject.disbursement.update',
    ADD_GROUP: 'c2cProject.beneficiary.addGroup',
    GET_ALL_GROUPS: 'c2cProject.beneficiary.getAllGroups',
    GET_ONE_GROUP: 'c2cProject.beneficiary.getOneGroup',
    //TEMP SOLUTION
    CREATE_SAFE_TRANSACTION: 'c2cProject.createSafeTransaction',
    GET_SAFE_TRANSACTION: 'c2cProject.getSafeTransaction',
    GET_SAFE_PENDING: 'c2cProject.getSafePending',
    CREATE_CAMPAIGN: 'c2cProject.campaign.create',
    CREATE_AUDIENCE: 'c2cProject.campaign.create_audience',
    GET_ALL_CAMPAIGN: 'c2cProject.campaign.get',
    GET_CAMPAIGN: 'c2cProject.campaign.getOne',
    GET_CAMPAIGN_LOG: 'c2cProject.campaign.log',
    GET_ALL_TRANSPORT: 'c2cProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'c2cProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'c2cProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'c2cProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'c2cProject.campaign.communication_stats',
    LIST_REPORTING: 'c2cProject.reporting.list',
  },
  CVAProject: {
    UPDATE_STATUS: 'cvaProject.updateStatus',
    REQUEST_TOKEN: 'cvaProject.requestToken',
    REQUEST_CLAIM: 'cvaProject.requestClaim',
    UPDATE_CLAIM: 'cvaProject.updateClaim',
    LIST_CLAIM: 'cvaProject.listClaim',
    GET_CLAIM: 'cvaProject.getClaim',
    PROCESS_OTP: 'cvaProject.processOtp',
    CREATE_CAMPAIGN: 'cvaProject.campaign.create',
    CREATE_AUDIENCE: 'cvaProject.campaign.create_audience',
    GET_ALL_CAMPAIGN: 'cvaProject.campaign.get',
    GET_CAMPAIGN: 'cvaProject.campaign.getOne',
    GET_ALL_TRANSPORT: 'cvaProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'cvaProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'cvaProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'cvaProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'cvaProject.campaign.communication_stats',
  },
  RPPROJECT: {
    CREATE_DISBURSEMENT: 'rpProject.disbursement.create',
    GET_ALL_DISBURSEMENT: 'rpProject.disbursements.get',
    GET_DISBURSEMENT: 'rpProject.disbursement.getOne',
    UPDATE_DISBURSEMENT: 'rpProject.disbursement.update',
    CREATE_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.create',
    GET_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.getOne',
    GET_ALL_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.get',
    UPDATE_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.update',
    CREATE_BULK_DISBURSEMENT: 'rpProject.disbursement.bulkCreate',
    CREATE_CAMPAIGN: 'rpProject.campaign.create',
    UPDATE_CAMPAIGN: 'rpProject.campaign.update',
    CREATE_AUDIENCE: 'rpProject.campaign.create_audience',
    CREATE_BULK_AUDIENCE: 'rpProject.campaign.create_bulk_audience',
    GET_ALL_CAMPAIGN: 'rpProject.campaign.get',
    GET_CAMPAIGN: 'rpProject.campaign.getOne',
    GET_ALL_TRANSPORT: 'rpProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'rpProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'rpProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'rpProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'rpProject.campaign.communication_stats',
    GET_CAMPAIGN_LOG: 'rpProject.campaign.log',
    REQUEST_REDEMPTION: 'rpProject.requestRedemption',
    UPDATE_REDEMPTION: 'rpProject.updateRedemption',
    LIST_REDEMPTION: 'rpProject.listRedemption',
    GET_VENDOR_REDEMPTION: 'rpProject.vendorRedemption',
    GET_REDEMPTION: 'rpProject.getRedemption',
    GENERATE_OTP_HASH: 'rpProject.generateOtpHash',
    GET_OFFLINE_BENEFICIARIES: 'rpProject.getOfflineBeneficiaries',
    SYNC_OFFLINE_BENEFICIARIES: 'rpProject.syncOfflineBeneficiaries',
    GET_OFFLINE_VENDORS: 'rpProject.getOfflineVendors',
    GET_OFFLINE_SINGLE_VENDOR: 'rpProject.getOfflineSingleVendor',
    SAVE_SYNCED_BENEFICIARIES_TO_VENDOR:
      'rpProject.saveSyncedBeneficiariesToVendor',
    ADD_GROUP: 'rpProject.beneficiary.addGroup',
    GET_ALL_GROUPS: 'rpProject.beneficiary.getAllGroups',
    GET_ONE_GROUP: 'rpProject.beneficiary.getOneGroup',
    GET_BENEFICIARIES_DISBURSEMENTS: 'rpProject.beneficiaries.getDisbursements',
    UPDATE_OFFLINE: 'rpProject.offlineBeneficiaries.update',
    GET_UNSYNCED_BENEFICIARIES: 'rpProject.beneficiaries.getUnsynced',
    GET_UNSYNCED_BENEFICIARY_GROUP: 'rpProject.beneficiary.group.get_unsynced',
    // TODO: move to kenya specific actions
    CREATE_WALKIN: 'rpProject.walkin.create',
    GET_WALKIN: 'rpProject.walkin.get',
    GET_ALL_WALKIN: 'rpProject.walkin.getAll',
    CREATE_BULK_WALKIN_BENEFICIARIES: 'rpProject.walkin.createBulk',
    LIST_REPORTING: 'rpProject.reporting.list',
    UPDATE_BENEFICIARY: 'rpProject.beneficiary.update',
    LIST_BENEFICIARY_REIMBURSEMENTS: 'rpProject.beneficiary.listReimbursements',
    SYNC_OFFLINE_TRANSACTIONS: 'rpProject.syncOfflineTransactions'

  },
  COMMS: {
    CREATE_CAMPAIGN: 'comms.campaign.create',
    UPDATE_CAMPAIGN: 'comms.campaign.update',
    CREATE_AUDIENCE: 'comms.campaign.create_audience',
    CREATE_BULK_AUDIENCE: 'comms.campaign.create_bulk_audience',
    GET_ALL_CAMPAIGN: 'comms.campaign.get',
    GET_CAMPAIGN: 'comms.campaign.getOne',
    GET_ALL_TRANSPORT: 'comms.campaign.get_transport',
    GET_ALL_AUDIENCE: 'comms.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'comms.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'comms.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'comms.campaign.communication_stats',
    GET_CAMPAIGN_LOG: 'comms.campaign.log',
    ADD_GROUP: 'comms.beneficiary.addGroup',
    GET_ALL_GROUPS: 'comms.beneficiary.getAllGroups',
    GET_ONE_GROUP: 'comms.beneficiary.getOneGroup',
  },
}


export const RABBIT_MQ = {
  AMQP_CONNECTION: 'AMQP_CONNECTION',
  CT_BENEFICIARY_EXPORT: 'CT_BENEFICIARY_EXPORT',
};
export const queueOptions: RabbitMQModuleOptions['queues'] = [
  {
    name: RABBIT_MQ.CT_BENEFICIARY_EXPORT,
    durable: true,
    options: {},
  },
];
