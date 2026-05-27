import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ScansService } from './scans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post('detect')
  async detectWaste(@Body('image') base64Image: string, @Request() req) {
    return this.scansService.detectWaste(base64Image, req.user.id);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.scansService.getUserScans(req.user.id);
  }

  @Get(':id')
  async getScanDetail(@Param('id') id: string, @Request() req) {
    return this.scansService.getScanDetail(id, req.user.id);
  }
}
