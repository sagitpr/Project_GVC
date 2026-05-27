import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboard(userId: string) {
    // 1. Get user profile details
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, ecoPoints: true, createdAt: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Aggregate user scans by category
    const categoryGroup = await this.prisma.scan.groupBy({
      by: ['category'],
      where: { userId },
      _count: {
        id: true,
      },
    });

    const categoryBreakdown = {
      PLASTIC: 0,
      ORGANIC: 0,
      PAPER: 0,
      GLASS: 0,
      ELECTRONIC: 0,
      METAL: 0,
      OTHERS: 0,
    };

    let totalUserScans = 0;
    categoryGroup.forEach((group) => {
      const count = group._count.id;
      categoryBreakdown[group.category] = count;
      totalUserScans += count;
    });

    // 3. Get recent 5 scans
    const recentScans = await this.prisma.scan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        category: true,
        ecoScore: true,
        brand: true,
        createdAt: true,
      },
    });

    // 4. Retrieve global community statistics
    const globalAggregates = await this.prisma.analyticsSummary.aggregate({
      _sum: {
        totalScans: true,
        plasticScans: true,
        organicScans: true,
        paperScans: true,
        glassScans: true,
        electronicScans: true,
        metalScans: true,
        carbonReduced: true,
      },
    });

    const communityStats = {
      totalScans: globalAggregates._sum.totalScans || 0,
      carbonReduced: parseFloat((globalAggregates._sum.carbonReduced || 0).toFixed(2)),
      breakdown: {
        PLASTIC: globalAggregates._sum.plasticScans || 0,
        ORGANIC: globalAggregates._sum.organicScans || 0,
        PAPER: globalAggregates._sum.paperScans || 0,
        GLASS: globalAggregates._sum.glassScans || 0,
        ELECTRONIC: globalAggregates._sum.electronicScans || 0,
        METAL: globalAggregates._sum.metalScans || 0,
      },
    };

    return {
      user: {
        username: user.username,
        ecoPoints: user.ecoPoints,
        totalScans: totalUserScans,
        memberSince: user.createdAt,
      },
      categoryBreakdown,
      recentScans,
      communityStats,
    };
  }
}
