export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UKNOWN = 'UNKNOWN',
}

export enum KoboBeneficiaryStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS'
}

export enum BeneficiaryType {
  REFERRED = 'REFERRED',
  ENROLLED = 'ENROLLED',
}

export enum BankedStatus {
  UNKNOWN = 'UNKNOWN',
  UNBANKED = 'UNBANKED',
  BANKED = 'BANKED',
  UNDER_BANKED = 'UNDER_BANKED',
}

export enum InternetStatus {
  UNKNOWN = 'UNKNOWN',
  NO_INTERNET = 'NO_INTERNET',
  HOME_INTERNET = 'HOME_INTERNET',
  MOBILE_INTERNET = 'MOBILE_INTERNET',
}

export enum PhoneStatus {
  UNKNOWN = 'UNKNOWN',
  NO_PHONE = 'NO_PHONE',
  FEATURE_PHONE = 'FEATURE_PHONE',
  SMART_PHONE = 'SMART_PHONE',
}

export enum ProjectTypes {
  CVA = 'CVA',
  EL = 'EL',
  ANTICIPATORY_ACTION = 'ANTICIPATORY_ACTION',
  C2C = 'C2C',
  PI = "PARAMETRIC_INSURANCE",
  RP = 'RAHAT_PAYROLL'
}

export enum UploadFileType {
  EXCEL = 'EXCEL',
  JSON = 'JSON',
  API = 'API',
  KOBO = 'KOBO',
}

export enum ProjectStatus {
  NOT_READY = 'NOT_READY',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}



export enum DisbursementConditionType {
  BALANCE_CHECK = 'BALANCE_CHECK',
  APPROVER_SIGNATURE = 'APPROVER_SIGNATURE',
  SCHEDULED_TIME = 'SCHEDULED_TIME',
}
