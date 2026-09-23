import { IUser } from './user';

export interface RequestOtpDto {
  mobile: string;
}

export interface VerifyOtpDto {
  mobile: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface JwtPayload {
  sub: string;
  mobile: string;
  roles: string[];
  permissions: string[];
}
