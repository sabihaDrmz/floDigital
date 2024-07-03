export type AccountLoginResult = {
  token: string;
  refreshToken: string;
  userInfo: string;
  employeeInfo: string;
  isValid: boolean;
  message: string;
  roles: string;
  clientId: string;
};
