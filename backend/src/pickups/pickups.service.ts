import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PickupsService {
  constructor(private prisma: PrismaService) {}

  // ─── Create Pickup Request ─────────────────────────────────────────────────

  async createPickup(
    userId: string,
    data: {
      wasteCategory: string;
      weight: number;
      address: string;
      latitude?: number;
      longitude?: number;
      pickupTime?: string;
    },
  ) {
    // Validasi input
    const validCategories = ['PLASTIC', 'ORGANIC', 'PAPER', 'GLASS', 'ELECTRONIC', 'METAL', 'OTHERS'];
    const category = data.wasteCategory.toUpperCase();

    if (!validCategories.includes(category)) {
      throw new BadRequestException(
        `Invalid waste category. Must be one of: ${validCategories.join(', ')}`,
      );
    }

    if (data.weight <= 0) {
      throw new BadRequestException('Weight must be greater than 0 kg');
    }

    if (!data.address || data.address.trim().length < 5) {
      throw new BadRequestException('Address must be at least 5 characters');
    }

    // Create pickup record
    const pickup = await this.prisma.pickup.create({
      data: {
        userId,
        wasteCategory: category,
        weight: data.weight,
        address: data.address,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        pickupTime: data.pickupTime ? new Date(data.pickupTime) : null,
        status: 'PENDING',
      },
    });

    // Create notification for user
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Pickup Diajukan',
        message: `Permintaan pickup ${category.toLowerCase()} seberat ${data.weight} kg telah diajukan. Kami akan menghubungi Anda segera.`,
        type: 'PICKUP',
      },
    });

    return {
      message: 'Pickup request created successfully',
      data: pickup,
    };
  }

  // ─── Get User Pickups ──────────────────────────────────────────────────────

  async getUserPickups(userId: string) {
    return this.prisma.pickup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get Pickup Detail ─────────────────────────────────────────────────────

  async getPickupDetail(pickupId: string, userId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { id: pickupId },
      include: {
        driver: {
          select: { id: true, username: true },
        },
      },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    // Allow access to owner, assigned driver, or admin
    if (pickup.userId !== userId && pickup.driverId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return pickup;
  }

  // ─── Cancel Pickup ─────────────────────────────────────────────────────────

  async cancelPickup(pickupId: string, userId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { id: pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own pickups');
    }

    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel pickup with status "${pickup.status}". Only PENDING pickups can be cancelled.`,
      );
    }

    const updated = await this.prisma.pickup.update({
      where: { id: pickupId },
      data: { status: 'CANCELLED' },
    });

    // Create notification
    await this.prisma.notification.create({
      data: {
        userId,
        title: 'Pickup Dibatalkan',
        message: `Permintaan pickup ${pickup.wasteCategory.toLowerCase()} telah dibatalkan.`,
        type: 'PICKUP',
      },
    });

    return {
      message: 'Pickup cancelled successfully',
      data: updated,
    };
  }

  // ─── Complete Pickup (driver action) ────────────────────────────────────────

  async completePickup(pickupId: string, driverId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { id: pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.driverId !== driverId) {
      throw new ForbiddenException('You are not the assigned driver for this pickup');
    }

    if (pickup.status !== 'ASSIGNED') {
      throw new BadRequestException(
        `Cannot complete pickup with status "${pickup.status}". Only ASSIGNED pickups can be completed.`,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // Update status
      const result = await tx.pickup.update({
        where: { id: pickupId },
        data: { status: 'COMPLETED' },
      });

      // Award eco points to user
      const pointsEarned = Math.round(pickup.weight * 10);
      await tx.user.update({
        where: { id: pickup.userId },
        data: { ecoPoints: { increment: pointsEarned } },
      });

      // Log eco points
      await tx.ecoPoint.create({
        data: {
          userId: pickup.userId,
          points: pointsEarned,
          activityType: 'PICKUP',
          description: `Pickup ${pickup.wasteCategory.toLowerCase()} ${pickup.weight} kg completed`,
        },
      });

      // Notify user
      await tx.notification.create({
        data: {
          userId: pickup.userId,
          title: 'Pickup Selesai',
          message: `Pickup ${pickup.wasteCategory.toLowerCase()} seberat ${pickup.weight} kg telah selesai. Anda mendapatkan ${pointsEarned} Eco Points!`,
          type: 'PICKUP',
        },
      });

      return result;
    });

    return {
      message: 'Pickup completed successfully',
      data: updated,
    };
  }

  // ─── Assign Driver (admin/driver acceptance) ───────────────────────────────

  async assignDriver(pickupId: string, driverId: string) {
    const pickup = await this.prisma.pickup.findUnique({
      where: { id: pickupId },
    });

    if (!pickup) {
      throw new NotFoundException('Pickup not found');
    }

    if (pickup.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot assign driver to pickup with status "${pickup.status}"`,
      );
    }

    const updated = await this.prisma.pickup.update({
      where: { id: pickupId },
      data: {
        driverId,
        status: 'ASSIGNED',
      },
    });

    // Notify user that driver was assigned
    await this.prisma.notification.create({
      data: {
        userId: pickup.userId,
        title: 'Driver Ditugaskan',
        message: `Driver telah ditugaskan untuk pickup ${pickup.wasteCategory.toLowerCase()} Anda.`,
        type: 'PICKUP',
      },
    });

    return {
      message: 'Driver assigned successfully',
      data: updated,
    };
  }

  // ─── Get Pickups by Status (driver view) ───────────────────────────────────

  async getPickupsByStatus(status?: string) {
    const validStatuses = ['PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];

    if (status && !validStatuses.includes(status.toUpperCase())) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    const where = status ? { status: status.toUpperCase() } : {};

    return this.prisma.pickup.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
  }

  // ─── Get Driver Pickups ────────────────────────────────────────────────────

  async getDriverPickups(driverId: string) {
    return this.prisma.pickup.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
  }
}
