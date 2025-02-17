export const EVENTS = {
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',
  PROJECT_DELETED: 'project.deleted',
  BENEFICIARY_ADDED_TO_PROJECT: 'beneficiary.added.to.project',
  REQUEST_REDEMPTION: 'request.redemption',
  UPDATE_REDEMPTION: 'update.redemption',
  REDEEM_VOUCHER: 'beneficiary.redeemVoucher'
};

export const JOBS = {
  PROJECT_CREATE: 'project.create',
  PROJECT_UPDATE: 'project.update',
  PROJECT_DELETE: 'project.delete',
  PROJECT_SETUP: 'rahat.jobs.project.setup',
  PROJECT_SETTINGS: 'rahat.jobs.settings.create',
  REDEEM_VOUCHER: 'rahat.jobs.project.redeemVoucher',
  PROCESS_OTP: 'rahat.jobs.project.otpProcess',
  ASSIGN_DISCOUNT_VOUCHER: 'rahat.jobs.project.discountVoucher',
  PROJECT_SETTINGS_LIST: 'rahat.jobs.settings.list',
  PROJECT_SETTINGS_GET: 'rahat.jobs.settings.get',
  PROJECT_SETTINGS_ADD: 'rahat.jobs.settings.add',
  REQUEST_REDEMPTION: 'rahat.jobs.project.request_redemption',
  UPDATE_REDEMPTION: 'rahat.jobs.project.update_redemption',
  LIST_REDEMPTION: 'rahat.jobs.project.list_redemption',
  GET_VENDOR_REDEMPTION: 'rahat.jobs.project.get_redemption_vendor',
  GET_ALL_STATS: 'rahat.jobs.project.get_all_stats',
  REQUEST_CLAIM: 'rahat.jobs.project.request_claim',
  GET_VENDOR_STATS: 'rahat.jobs.project.get_vendor_stats',


  DISBURSEMENT_PLAN: {
    CREATE_DISBURSEMENT: 'rahat.jobs.disbursement.create',
    LIST_DISBURSEMENT: 'rahat.jobs.disbursement.list',
    FINDONE_DISBURSEMENT: 'rahat.jobs.disbursement.listone',
    UPDATE_DISBURSEMENT: 'rahat.jobs.disbursement.update',
    CREATE_DISBURSEMENT_PLAN: 'rahat.jobs.disbursement_plan.create',
    LIST_DISBURSEMENT_PLAN: 'rahat.jobs.disbursement_plan.list',
    FINDONE_DISBURSEMENT_PLAN: 'rahat.jobs.disbursement_plan.listone',
    UPDATE_DISBURSEMENT_PLAN: 'rahat.jobs.disbursement_plan.update',
    BULK_CREATE_DISBURSEMENT: 'rahat.jobs.disbursement.bulk_create',
  },
  CAMPAIGN: {
    CREATE_CAMPAIGN: 'rahat.jobs.campaign.create',
    LIST_CAMPAIGN: 'rahat.jobs.campaign.list',
    UPDATE_CAMPAIGN: 'rahat.jobs.campaign.update',
    FINDONE_CAMPAIGN: 'rahat.jobs.campaign.get',
    GET_ALL_TRANSPORT: 'rahat.jobs.campaign.get_transport',
    GET_ALL_AUDIENCE: 'rahat.jobs.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'rahat.jobs.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'rahat.jobs.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'rahat.jobs.campaign.communication_stats',
    CREATE_AUDIENCE: 'rahat.jobs.campaign.create_audience',
    CREATE_BULK_AUDIENCE: 'rahat.jobs.campaign.create_bulk_audience',
    GET_CAMPAIGN_LOG: 'rahat.jobs.campaign.log',
  },
  OFFLINE_BENEFICIARIES: {
    SYNC_BENEFICIARIES: "rahat.jobs.sync_beneficiaries",
    GET_SYNCED_BENEFICIARIES: "rahat.jobs.get_synced_beneficiaries",
    GET_OFFLINE_VENDORS: "rahat.jobs.get_offline_vendors",
    GET_OFFLINE_SINGLE_VENDOR: "rahat.jobs.get_offline_single_vendor",
    SAVE_SYNCED_BENEFICIARIES_TO_VENDOR: "rahat.jobs.save_synced_beneficiaries_to_vendor",
    UPDATE_OFFLINE_BENEFICIARY: 'rahat.jobs.beneficiary.update_offline',

  },
  BENEFICIARY: {
    ADD_GROUP: 'rahat.jobs.beneficiary.addGroup',
    GET_ALL_GROUPS: 'rahat.jobs.beneficiary.getAllGroups',
    GET_ONE_GROUP: 'rahat.jobs.beneficiary.getOneGroup',
    GET_BENEFICIARIES_DISBURSEMENTS: 'rahat.jobs.beneficiaries.getDisbursements',

  },

};
