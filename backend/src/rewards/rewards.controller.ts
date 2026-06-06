import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // ─── Public: List Rewards ────────────────────────────────────────────────

  @Get()
  async listRewards() {
    return this.rewardsService.listRewards();
  }

  // ─── Public: Get Reward Detail ──────────────────────────────────────────

  @Get(':id')
  async getRewardDetail(@Param('id') id: string) {
    return this.rewardsService.getRewardDetail(id);
  }

  // ─── Protected: Claim a Reward ──────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post(':id/claim')
  async claimReward(@Param('id') id: string, @Request() req) {
    return this.rewardsService.claimReward(req.user.id, id);
  }

  // ─── Protected: Get My Claims ───────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('my/claims')
  async getMyClaims(@Request() req) {
    return this.rewardsService.getMyClaims(req.user.id);
  }
}
