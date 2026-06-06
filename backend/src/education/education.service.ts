import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  // ─── List All Categories ─────────────────────────────────────────────────

  async getCategories() {
    const categories = await this.prisma.educationContent.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  // ─── List by Category ────────────────────────────────────────────────────

  async getByCategory(category?: string) {
    const where = category ? { category: category.toUpperCase() } : {};
    return this.prisma.educationContent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get Detail ──────────────────────────────────────────────────────────

  async getDetail(id: string) {
    const content = await this.prisma.educationContent.findUnique({
      where: { id },
    });
    if (!content) {
      throw new NotFoundException('Education content not found');
    }
    return content;
  }
}
