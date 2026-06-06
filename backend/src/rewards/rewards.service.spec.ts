import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from './rewards.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let prisma: any;

  const mockReward = {
    id: 'reward-1',
    title: 'Voucher GoPay Rp10.000',
    description: 'Tukarkan Eco Coins untuk voucher GoPay',
    pointsRequired: 500,
    code: 'GOPAY10K',
    stock: 10,
    imageUrl: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUser = {
    id: 'user-1',
    ecoCoins: 1000,
    ecoPoints: 2000,
  };

  const mockClaim = {
    id: 'claim-1',
    userId: 'user-1',
    rewardId: 'reward-1',
    status: 'CLAIMED',
    createdAt: new Date('2024-01-02'),
    reward: mockReward,
  };

  beforeEach(async () => {
    prisma = {
      reward: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      claimedReward: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── listRewards ──────────────────────────────────────────────────────────

  describe('listRewards', () => {
    it('should return only rewards with stock > 0 sorted by pointsRequired asc', async () => {
      prisma.reward.findMany.mockResolvedValue([mockReward]);

      const result = await service.listRewards();

      expect(result).toEqual({ data: [mockReward] });
      expect(prisma.reward.findMany).toHaveBeenCalledWith({
        orderBy: { pointsRequired: 'asc' },
        where: { stock: { gt: 0 } },
      });
    });

    it('should return empty array when no rewards available', async () => {
      prisma.reward.findMany.mockResolvedValue([]);

      const result = await service.listRewards();

      expect(result.data).toEqual([]);
    });
  });

  // ─── getRewardDetail ─────────────────────────────────────────────────────

  describe('getRewardDetail', () => {
    it('should return reward when found', async () => {
      prisma.reward.findUnique.mockResolvedValue(mockReward);

      const result = await service.getRewardDetail('reward-1');

      expect(result).toEqual(mockReward);
    });

    it('should throw NotFoundException when reward not found', async () => {
      prisma.reward.findUnique.mockResolvedValue(null);

      await expect(service.getRewardDetail('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── claimReward ─────────────────────────────────────────────────────────

  describe('claimReward', () => {
    it('should throw NotFoundException when reward does not exist', async () => {
      prisma.reward.findUnique.mockResolvedValue(null);

      await expect(service.claimReward('user-1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when stock is empty', async () => {
      prisma.reward.findUnique.mockResolvedValue({ ...mockReward, stock: 0 });

      await expect(service.claimReward('user-1', 'reward-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prisma.reward.findUnique.mockResolvedValue(mockReward);
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.claimReward('nonexistent-user', 'reward-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user has insufficient Eco Coins', async () => {
      prisma.reward.findUnique.mockResolvedValue(mockReward);
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, ecoCoins: 100 }); // needs 500

      await expect(service.claimReward('user-1', 'reward-1')).rejects.toThrow(BadRequestException);
    });

    it('should successfully claim a reward', async () => {
      prisma.reward.findUnique.mockResolvedValue(mockReward);
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.$transaction.mockResolvedValue([
        { ...mockUser, ecoCoins: 500 }, // 1000 - 500
        { ...mockReward, stock: 9 },
        mockClaim,
      ]);

      const result = await service.claimReward('user-1', 'reward-1');

      expect(result.message).toBe('Reward berhasil diklaim!');
      expect(result.data.claim).toEqual(mockClaim);
      expect(result.data.remainingCoins).toBe(500);
    });
  });

  // ─── getMyClaims ─────────────────────────────────────────────────────────

  describe('getMyClaims', () => {
    it('should return all claims for the user', async () => {
      prisma.claimedReward.findMany.mockResolvedValue([mockClaim]);

      const result = await service.getMyClaims('user-1');

      expect(result).toEqual({ data: [mockClaim] });
      expect(prisma.claimedReward.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        include: { reward: true },
      });
    });

    it('should return empty array when user has no claims', async () => {
      prisma.claimedReward.findMany.mockResolvedValue([]);

      const result = await service.getMyClaims('user-1');

      expect(result.data).toEqual([]);
    });
  });
});
