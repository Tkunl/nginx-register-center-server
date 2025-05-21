function e(module: number, error: number = 0) {
  return module * 10000 + error
}

const enum ErrorDomain {
  SYSTEM = 1,
  AUTH = 2,
  LOCKER = 3,
  MONGO = 4,
  NGINX = 5,
  DOCKER = 6,
}

export enum DefaultCode {
  OK = 0,
  ERROR = e(ErrorDomain.SYSTEM),
}

export enum SystemErrorCode {
  IO_ERROR = e(ErrorDomain.SYSTEM, 1),
  PARAM_VALIDATION_ERROR = e(ErrorDomain.SYSTEM, 2),
}

export enum AuthErrorCode {
  NEED_ACTIVATED = e(ErrorDomain.AUTH, 1),
  NO_ANY_PERMISSIONS = e(ErrorDomain.AUTH, 2),
  NO_SUCH_FILE = e(ErrorDomain.AUTH, 3),
  NOT_ACTIVE = e(ErrorDomain.AUTH, 4),
  USER_NAME_OR_PASSWORD_ERROR = e(ErrorDomain.AUTH, 5),
  INVALID_TOKEN = e(ErrorDomain.AUTH, 6),
  EXPIRED_TOKEN = e(ErrorDomain.AUTH, 7),
  BAD_TOKEN = e(ErrorDomain.AUTH, 8),
  USER_EXISTED = e(ErrorDomain.AUTH, 9),
  CAPTCHA_ERROR = e(ErrorDomain.AUTH, 10),
  CAPTCHA_EXPIRED = e(ErrorDomain.AUTH, 11),
  CAPTCHA_SEND_FAILURE = e(ErrorDomain.AUTH, 12),
  LOGIN_EXPIRED = e(ErrorDomain.AUTH, 13),
  CAN_NOT_RESEND_EMAIL = e(ErrorDomain.AUTH, 14),
}

export enum DockerErrorCode {
  DOCKER_CONNECT_ERROR = e(ErrorDomain.DOCKER, 1),
  CONTAINER_NOT_FOUND = e(ErrorDomain.DOCKER, 2),
  CONTAINER_RESTART_FAILED = e(ErrorDomain.DOCKER, 3),
  IMAGE_PULL_FAILED = e(ErrorDomain.DOCKER, 4),
}

export enum MongoErrorCode {
  WRITE_FAILED = e(ErrorDomain.MONGO, 1),
  READ_FAILED = e(ErrorDomain.MONGO, 2),
}

export enum LockerSvcErrorCode {
  LOCK_DIR_CREATE_FAILED = e(ErrorDomain.LOCKER, 1),
}

export enum NginxErrorCode {
  APP_NAME_EXIST = e(ErrorDomain.NGINX, 1),
  APP_CONFIG_NOT_EXIST = e(ErrorDomain.NGINX, 2),
  EJS_TEMPLATE_READ_FAILED = e(ErrorDomain.NGINX, 3),
  CONFIG_WRITE_FAILED = e(ErrorDomain.NGINX, 4),
}
