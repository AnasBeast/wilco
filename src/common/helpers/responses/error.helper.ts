export const errors = {
  INVALID_CREDO: {
    message: 'Incorrect user name or password',
    code: 'INVALID_CREDO',
  },
  INVALID_TOKEN: {
    message: 'Incorrect token or user do not exist',
    code: 'INVALID_TOKEN',
  },
  INVALID_ID: {
    message: 'Incorrect id format',
    code: 'INVALID_ID',
  },
  USER_EXIST: { message: 'User already exists', code: 'USER_EXIST' },
  PHONE_EXIST: { message: 'Phone number already exists', code: 'PHONE_EXIST' },
  ROLE_EXIST: { message: 'Role already exists', code: 'ROLE_EXIST' },
  ROLE_NOT_EXIST: { message: 'Role not exists', code: 'ROLE_NOT_EXIST' },
  AIRPORT_NOT_EXIST: { message: 'Airport not exists', code: 'AIRPORT_NOT_EXIST' },
  HOME_AIRPORT_NOT_EXIST: { message: 'Home airport for pilot not exists', code: 'HOME_AIRPORT_NOT_EXIST' },
  FILE_UPLOAD_ERROR: { message: 'Error on upload file to aws s3', code: 'FILE_UPLOAD_ERROR' },
  ADMIN_EXIST: { message: 'Admin already exists', code: 'ADMIN_EXIST' },
  USER_NOT_EXIST: { message: 'User does not exists', code: 'USER_NOT_EXIST' },
  NO_ACCESS: {
    message: 'You have no access',
    code: 'NO_ACCESS',
  },
  SOMETHING_WRONG: {
    message: 'Sorry, something went wrong, try again later',
    code: 'SOMETHING_WRONG',
  },
  USER_DELETED: {
    message: 'User deleted or is not active',
    code: 'USER_DELETED',
  },
  SUPERADMIN: { message: 'You are not a superadmin', code: 1000 },
  SAME_STATUS: { message: 'same status', code: 'SAME_STATUS' },
  EMPTY_AVATAR: { message: 'You must provide your avatar', code: 'EMPTY_AVATAR' },
  AIRCRAFT_NOT_FOUND: { message: 'Aircraft not found', code: 'AIRCRAFT_NOT_FOUND' },
  MISSING_TAIL_NUMBER: { message: "The provided aircraft doesn't have tail number", code: 'MISSING_TAIL_NUMBER' },
  PERMISSION_DENIED: { message: "You don't have permission to perform this action", code: "PERMISSION_DENIED" }
};
