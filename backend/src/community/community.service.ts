import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  // ─── Create Post ─────────────────────────────────────────────────────────

  async createPost(userId: string, data: { title: string; content: string; imageUrl?: string }) {
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (!data.content || data.content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters');
    }

    const post = await this.prisma.communityPost.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || null,
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    return { message: 'Post created successfully', data: post };
  }

  // ─── List Posts ──────────────────────────────────────────────────────────

  async listPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, username: true },
          },
        },
      }),
      this.prisma.communityPost.count(),
    ]);

    return {
      data: posts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Get Post Detail ─────────────────────────────────────────────────────

  async getDetail(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  // ─── Delete Post ─────────────────────────────────────────────────────────

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.communityPost.delete({ where: { id: postId } });

    return { message: 'Post deleted successfully' };
  }

  // ─── Like Post ───────────────────────────────────────────────────────────

  async likePost(postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updated = await this.prisma.communityPost.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    return { message: 'Post liked', data: updated };
  }
}
