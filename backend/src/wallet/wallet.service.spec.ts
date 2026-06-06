import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let prisma: any;

  const mockWallet = {
    id: 'wallet-1',
    userId: 'user-1',
    balance: 100000,
    currency: 'IDR',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockTransaction = {
    id: 'tx-1',
    walletId: 'wallet-1',
    amount: 50000,
    type: 'DEPOSIT',
    description: 'Top-up saldo dompet',
    createdAt: new Date('2024-01-02'),
  };

  beforeEach(async () => {
    prisma = {
      wallet: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── getWallet ────────────────────────────────────────────────────────────

  describe('getWallet', () => {
    it('should return existing wallet', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);

      const result = await service.getWallet('user-1');

      expect(result).toEqual(mockWallet);
      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(prisma.wallet.create).not.toHaveBeenCalled();
    });

    it('should create a new wallet if none exists', async () => {
      prisma.wallet.findUnique.mockResolvedValue(null);
      prisma.wallet.create.mockResolvedValue(mockWallet);

      const result = await service.getWallet('user-1');

      expect(result).toEqual(mockWallet);
      expect(prisma.wallet.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', balance: 0.0, currency: 'IDR' },
      });
    });
  });

  // ─── listTransactions ────────────────────────────────────────────────────

  describe('listTransactions', () => {
    it('should return paginated transactions with default params', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.transaction.findMany.mockResolvedValue([mockTransaction]);
      prisma.transaction.count.mockResolvedValue(1);

      const result = await service.listTransactions('user-1', 1, 20);

      expect(result).toEqual({
        data: [mockTransaction],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { walletId: 'wallet-1' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should calculate skip offset correctly for non-default pagination', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.transaction.findMany.mockResolvedValue([]);
      prisma.transaction.count.mockResolvedValue(25);

      await service.listTransactions('user-1', 3, 10);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { walletId: 'wallet-1' },
        orderBy: { createdAt: 'desc' },
        skip: 20,
        take: 10,
      });
      expect(prisma.transaction.count).toHaveBeenCalledWith({
        where: { walletId: 'wallet-1' },
      });
    });

    it('should handle empty transactions', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.transaction.findMany.mockResolvedValue([]);
      prisma.transaction.count.mockResolvedValue(0);

      const result = await service.listTransactions('user-1');

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  // ─── topUp ───────────────────────────────────────────────────────────────

  describe('topUp', () => {
    it('should throw BadRequestException for amount <= 0', async () => {
      await expect(service.topUp('user-1', 0)).rejects.toThrow(BadRequestException);
      await expect(service.topUp('user-1', -100)).rejects.toThrow(BadRequestException);
    });

    it('should successfully top up wallet', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.$transaction.mockResolvedValue([
        { ...mockWallet, balance: 150000 },
      ]);

      const result = await service.topUp('user-1', 50000);

      expect(result.message).toBe('Top-up berhasil');
      expect(result.balance).toBe(150000);
    });
  });

  // ─── earn ────────────────────────────────────────────────────────────────

  describe('earn', () => {
    it('should throw BadRequestException for amount <= 0', async () => {
      await expect(service.earn('user-1', 0, 'test')).rejects.toThrow(BadRequestException);
    });

    it('should successfully record earnings', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.$transaction.mockResolvedValue([
        { ...mockWallet, balance: 105000 },
      ]);

      const result = await service.earn('user-1', 5000, 'Hadiah scan sampah');

      expect(result.message).toBe('Pendapatan berhasil dicatat');
      expect(result.balance).toBe(105000);
    });
  });

  // ─── withdraw ────────────────────────────────────────────────────────────

  describe('withdraw', () => {
    it('should throw BadRequestException for amount <= 0', async () => {
      await expect(service.withdraw('user-1', 0)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when balance is insufficient', async () => {
      prisma.wallet.findUnique.mockResolvedValue({
        ...mockWallet,
        balance: 10000,
      });

      await expect(service.withdraw('user-1', 50000)).rejects.toThrow(BadRequestException);
    });

    it('should successfully withdraw from wallet', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.$transaction.mockResolvedValue([
        { ...mockWallet, balance: 50000 },
      ]);

      const result = await service.withdraw('user-1', 50000, 'Penarikan ke GoPay');

      expect(result.message).toBe('Penarikan berhasil');
      expect(result.balance).toBe(50000);
    });

    it('should use default description when none provided', async () => {
      prisma.wallet.findUnique.mockResolvedValue(mockWallet);
      prisma.$transaction.mockResolvedValue([
        { ...mockWallet, balance: 50000 },
      ]);

      const result = await service.withdraw('user-1', 50000);

      expect(result.message).toBe('Penarikan berhasil');
    });
  });
});
