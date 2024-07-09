export enum ErrorType {
    SERVER_ERROR = 'Server error',
    LOGIN_FAIL = 'Login Fail',
    PASSWORD_NOT_MATCH = 'Passwords do not match!',
    REGISTER_FAIL = 'Failed to register user',
    USER_EXISTS = 'User already exists'
}

export enum SuccessType {
    REGISTER = 'User register success',
    LOGIN = 'Login success',
}