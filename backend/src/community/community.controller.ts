import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // ─── Public: List Posts ─────────────────────────────────────────────────

  @Get()
  async listPosts(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communityService.listPosts(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // ─── Public: Get Detail ─────────────────────────────────────────────────

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    return this.communityService.getDetail(id);
  }

  // ─── Protected: Create Post ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() body: { title: string; content: string; imageUrl?: string },
    @Request() req,
  ) {
    return this.communityService.createPost(req.user.id, body);
  }

  // ─── Protected: Delete Post ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.communityService.deletePost(id, req.user.id);
  }

  // ─── Public: Like Post ──────────────────────────────────────────────────

  @Patch(':id/like')
  async likePost(@Param('id') id: string) {
    return this.communityService.likePost(id);
  }
}
