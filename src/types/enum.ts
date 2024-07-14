export enum API_URL {
  ALL_COIN_LIST = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  COIN_LIST = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
  COIN_INFO = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
  COIN_USER = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest",
}


export enum ErrorType {
  NOT_FOUND = "Not found",
  HACKER = "Hacker?",
  SERVER_ERROR = "Server error",
  LOGIN_FAIL = "Username or Password Incorrect",
  PASSWORD_NOT_MATCH = "Passwords do not match!",
  REGISTER_FAIL = "Failed to register user",
  USER_EXISTS = "User already exists",
  USER_NOT_FOUND = "User not found",
  CMC_KEY = "API key not found",
  COIN_NOT_FOUND = "Coin not found",
  ADD_COIN_FAIL = "Add coin fail",
  UPDATE_PORT_FAIL = "Add coin fail",
  COIN_OR_USER_NOT_FOUND = "Coin or User not found"
}

export enum SuccessType {
  REGISTER = "User register success",
  LOGIN = "Login success",
  COIN_SUCCESS = "Add coin success",
  PORT_SUCCESS = "Get Portfolio success",
  UPDATE_PORT_SUCCESS = "Portfolio update success",
  DELETE_COIN_SUCCESS = "Delete coin success",
}
