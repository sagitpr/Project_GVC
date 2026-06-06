import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // ─── Get or create wallet ────────────────────────────────────────────────

  private async ensureWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { userId, balance: 0.0, currency: 'IDR' },
      });
    }
    return wallet;
  }

  // ─── Get Wallet + Balance ────────────────────────────────────────────────

  async getWallet(userId: string) {
    const wallet = await this.ensureWallet(userId);
    return wallet;
  }

  // ─── List Transactions (paginated) ───────────────────────────────────────

  async listTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.ensureWallet(userId);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      data: transactions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Top Up (Deposit) ────────────────────────────────────────────────────

  async topUp(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.ensureWallet(userId);

    const [updatedWallet] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'DEPOSIT',
          description: 'Top-up saldo dompet',
        },
      }),
    ]);

    return {
      message: 'Top-up berhasil',
      balance: updatedWallet.balance,
    };
  }

  // ─── Earn from activity (scan, pickup, etc.) ─────────────────────────────

  async earn(userId: string, amount: number, description: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.ensureWallet(userId);

    const [updatedWallet] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'EARN',
          description,
        },
      }),
    ]);

    return {
      message: 'Pendapatan berhasil dicatat',
      balance: updatedWallet.balance,
    };
  }

  // ─── Withdraw ────────────────────────────────────────────────────────────

  async withdraw(userId: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.ensureWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Saldo tidak mencukupi');
    }

    const [updatedWallet] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: -amount } },
      }),
      this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          type: 'WITHDRAWAL',
          description: description || 'Penarikan saldo',
        },
      }),
    ]);

    return {
      message: 'Penarikan berhasil',
      balance: updatedWallet.balance,
    };
  }
}
