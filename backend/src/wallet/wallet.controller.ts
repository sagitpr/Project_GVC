import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // ─── Get Wallet ──────────────────────────────────────────────────────────

  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.id);
  }

  // ─── List Transactions ───────────────────────────────────────────────────

  @Get('transactions')
  async listTransactions(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.walletService.listTransactions(
      req.user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  // ─── Top Up ──────────────────────────────────────────────────────────────

  @Post('topup')
  async topUp(@Request() req, @Body() body: { amount: number }) {
    return this.walletService.topUp(req.user.id, body.amount);
  }

  // ─── Withdraw ────────────────────────────────────────────────────────────

  @Post('withdraw')
  async withdraw(
    @Request() req,
    @Body() body: { amount: number; description?: string },
  ) {
    return this.walletService.withdraw(req.user.id, body.amount, body.description);
  }
}
