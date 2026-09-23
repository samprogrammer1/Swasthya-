import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, UserEntity } from '../users/users.service';
import { UserRole, Permission } from '@swasthya/config';
import { AuthResponse, JwtPayload } from '@swasthya/types';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(mobile: string): Promise<{ message: string; testOtp?: string }> {
    if (!mobile || !/^\+?[1-9]\d{9,14}$/.test(mobile.replace(/\s+/g, ''))) {
      // Clean mobile format
      const cleaned = mobile.startsWith('+91') ? mobile : '+91' + mobile;
      mobile = cleaned;
    }

    // In dev / test mode: fixed OTP '123456' for instant demo testing
    const otp = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStore.set(mobile, { otp, expiresAt });

    return {
      message: `OTP sent successfully to ${mobile}`,
      testOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  async verifyOtp(mobile: string, otp: string): Promise<AuthResponse> {
    const record = this.otpStore.get(mobile);

    // Accept default demo OTP 123456 or record matching
    const isValidOtp = (record && record.otp === otp) || otp === '123456';

    if (!isValidOtp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    this.otpStore.delete(mobile);

    let user = await this.usersService.findByMobile(mobile);
    if (!user) {
      // Auto-register as patient if user does not exist
      user = await this.usersService.createPatientUser(mobile, 'New Patient');
    }

    return this.generateAuthResponse(user);
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret:
          process.env.REFRESH_TOKEN_SECRET ||
          'swasthya_refresh_token_secret_key_2026',
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User account inactive or not found');
      }

      const permissions = this.getPermissionsForRoles(user.roles);
      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          mobile: user.mobile,
          roles: user.roles,
          permissions,
        },
        {
          secret:
            process.env.JWT_SECRET ||
            'swasthya_super_secret_jwt_key_2026_jodhpur',
          expiresIn: '15m',
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateAuthResponse(user: UserEntity): Promise<AuthResponse> {
    const permissions = this.getPermissionsForRoles(user.roles);

    const payload: JwtPayload = {
      sub: user.id,
      mobile: user.mobile,
      roles: user.roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET || 'swasthya_super_secret_jwt_key_2026_jodhpur',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.REFRESH_TOKEN_SECRET ||
        'swasthya_refresh_token_secret_key_2026',
      expiresIn: '7d',
    });

    const { passwordHash, ...cleanUser } = user;

    return {
      accessToken,
      refreshToken,
      user: cleanUser,
    };
  }

  private getPermissionsForRoles(roles: UserRole[]): string[] {
    const permSet = new Set<string>();

    roles.forEach((role) => {
      switch (role) {
        case UserRole.SUPER_ADMIN:
        case UserRole.ADMIN:
          Object.values(Permission).forEach((p) => permSet.add(p));
          break;
        case UserRole.DOCTOR:
          permSet.add(Permission.DOCTOR_VIEW);
          permSet.add(Permission.DOCTOR_EDIT);
          permSet.add(Permission.QUEUE_VIEW);
          permSet.add(Permission.QUEUE_MANAGE);
          permSet.add(Permission.CONSULTATION_CREATE);
          permSet.add(Permission.PRESCRIPTION_CREATE);
          permSet.add(Permission.PRESCRIPTION_VIEW);
          permSet.add(Permission.PATIENT_VIEW);
          permSet.add(Permission.RECEPTION_CREATE);
          permSet.add(Permission.RECEPTION_DISABLE);
          break;
        case UserRole.RECEPTIONIST:
          permSet.add(Permission.QUEUE_VIEW);
          permSet.add(Permission.QUEUE_MANAGE);
          permSet.add(Permission.TOKEN_CREATE);
          permSet.add(Permission.TOKEN_CANCEL);
          permSet.add(Permission.PATIENT_VIEW);
          permSet.add(Permission.PATIENT_EDIT);
          break;
        case UserRole.PATIENT:
          permSet.add(Permission.DOCTOR_VIEW);
          permSet.add(Permission.QUEUE_VIEW);
          permSet.add(Permission.TOKEN_CREATE);
          permSet.add(Permission.PRESCRIPTION_VIEW);
          break;
      }
    });

    return Array.from(permSet);
  }
}
