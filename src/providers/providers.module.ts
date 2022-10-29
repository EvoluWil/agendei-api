import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from './jwt/jwt.modules';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), JwtModule, PrismaModule, AuthModule],
  providers: [],
  exports: [],
})
export class ProvidersModule {}
