import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/pickups')
export class PickupsController {
  constructor(private readonly pickupsService: PickupsService) {}

  // ─── Create Pickup ─────────────────────────────────────────────────────────

  @Post()
  async createPickup(
    @Body()
    body: {
      wasteCategory: string;
      weight: number;
      address: string;
      latitude?: number;
      longitude?: number;
      pickupTime?: string;
    },
    @Request() req,
  ) {
    return this.pickupsService.createPickup(req.user.id, body);
  }

  // ─── Get User Pickups ──────────────────────────────────────────────────────

  @Get()
  async getMyPickups(@Request() req) {
    return this.pickupsService.getUserPickups(req.user.id);
  }

  // ─── Get Pickup Detail ─────────────────────────────────────────────────────

  @Get(':id')
  async getPickupDetail(@Param('id') id: string, @Request() req) {
    return this.pickupsService.getPickupDetail(id, req.user.id);
  }

  // ─── Cancel Pickup ─────────────────────────────────────────────────────────

  @Patch(':id/cancel')
  async cancelPickup(@Param('id') id: string, @Request() req) {
    return this.pickupsService.cancelPickup(id, req.user.id);
  }

  // ─── Complete Pickup (driver action — requires role system, future use) ────
  // @Patch(':id/complete')
  // async completePickup(@Param('id') id: string, @Request() req) {
  //   return this.pickupsService.completePickup(id, req.user.id);
  // }

  // ─── Assign Driver (requires role system, future use) ──────────────────────
  // @Patch(':id/assign')
  // async assignDriver(@Param('id') id: string, @Request() req) {
  //   return this.pickupsService.assignDriver(id, req.user.id);
  // }
}
