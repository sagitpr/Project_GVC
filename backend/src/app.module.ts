import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ScansModule } from './scans/scans.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PickupsModule } from './pickups/pickups.module';
import { EducationModule } from './education/education.module';
import { CommunityModule } from './community/community.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WalletModule } from './wallet/wallet.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ScansModule,
    AnalyticsModule,
    PickupsModule,
    EducationModule,
    CommunityModule,
    NotificationsModule,
    WalletModule,
    RewardsModule,
  ],
})
export class AppModule {}
