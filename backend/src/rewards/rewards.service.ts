import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  // ─── List All Rewards ────────────────────────────────────────────────────

  async listRewards() {
    const rewards = await this.prisma.reward.findMany({
      orderBy: { pointsRequired: 'asc' },
      where: { stock: { gt: 0 } },
    });
    return { data: rewards };
  }

  // ─── Get Reward Detail ───────────────────────────────────────────────────

  async getRewardDetail(id: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    return reward;
  }

  // ─── Claim a Reward ──────────────────────────────────────────────────────

  async claimReward(userId: string, rewardId: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (reward.stock <= 0) {
      throw new BadRequestException('Reward has run out of stock');
    }

    // Get user with ecoCoins
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, ecoCoins: true, ecoPoints: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.ecoCoins < reward.pointsRequired) {
      throw new BadRequestException(
        `Insufficient Eco Coins. You need ${reward.pointsRequired} coins but only have ${user.ecoCoins}.`,
      );
    }

    // Execute claim in transaction: decrement user coins, decrement stock, create claim record
    const [updatedUser, claim] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          ecoCoins: { decrement: reward.pointsRequired },
        },
      }),
      this.prisma.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      }),
      this.prisma.claimedReward.create({
        data: {
          userId,
          rewardId,
          status: 'CLAIMED',
        },
        include: {
          reward: true,
        },
      }),
    ]);

    return {
      message: 'Reward berhasil diklaim!',
      data: {
        claim,
        remainingCoins: updatedUser.ecoCoins,
      },
    };
  }

  // ─── Get User's Claimed Rewards ──────────────────────────────────────────

  async getMyClaims(userId: string) {
    const claims = await this.prisma.claimedReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reward: true,
      },
    });

    return { data: claims };
  }
}
