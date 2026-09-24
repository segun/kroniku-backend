import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { DevicesModule } from '../devices/devices.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthIdentity } from './entities/auth-identity.entity';
import { ProviderTokenVerifierService } from './provider-token-verifier.service';

const MINIMUM_JWT_EXPIRES_SECONDS = 60 * 60 * 24 * 30;

export function normalizeJwtExpirationSeconds(value: string | number | undefined): number {
  const parsed = value === undefined ? MINIMUM_JWT_EXPIRES_SECONDS : Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return MINIMUM_JWT_EXPIRES_SECONDS;
  }
  return Math.max(parsed, MINIMUM_JWT_EXPIRES_SECONDS);
}

@Module({
  imports: [
    UsersModule,
    DevicesModule,
    TypeOrmModule.forFeature([AuthIdentity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = normalizeJwtExpirationSeconds(
          configService.get<string | number>('JWT_EXPIRES_SECONDS'),
        );
        return {
          secret: configService.get<string>('JWT_SECRET', 'dev-secret'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ProviderTokenVerifierService],
  exports: [AuthService],
})
export class AuthModule {}
