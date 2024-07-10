export enum ErrorType {
  SERVER_ERROR = "Server error",
  LOGIN_FAIL = "Login Fail",
  PASSWORD_NOT_MATCH = "Passwords do not match!",
  REGISTER_FAIL = "Failed to register user",
  USER_EXISTS = "User already exists",
  USER_NOT_FOUND = "User not found",
  CMC_KEY = "API key not found",
  COIN_NOT_FOUND = "Coin not found",
}

export enum SuccessType {
  REGISTER = "User register success",
  LOGIN = "Login success",
}
