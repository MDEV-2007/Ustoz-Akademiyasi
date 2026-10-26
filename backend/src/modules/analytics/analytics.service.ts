import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { RegistrationStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(startDateStr?: string, endDateStr?: string) {
    const where: any = {};
    if (startDateStr || endDateStr) {
      where.createdAt = {};
      if (startDateStr) where.createdAt.gte = new Date(startDateStr);
      if (endDateStr) where.createdAt.lte = new Date(endDateStr);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      todayLeads,
      leadsByStatusRaw,
      leadsByCourseRaw,
      leadsByBranchRaw,
      recentLeads,
    ] = await Promise.all([
      this.prisma.trialRegistration.count({ where }),
      this.prisma.trialRegistration.count({ where: { ...where, createdAt: { gte: startOfToday } } }),
      this.prisma.trialRegistration.groupBy({
        by: ['status'],
        where,
        _count: { _all: true },
      }),
      this.prisma.trialRegistration.groupBy({
        by: ['courseId'],
        where,
        _count: { _all: true },
      }),
      this.prisma.trialRegistration.groupBy({
        by: ['branchId'],
        where,
        _count: { _all: true },
      }),
      this.prisma.trialRegistration.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceId: true,
          fullName: true,
          phoneFormatted: true,
          status: true,
          createdAt: true,
          course: { select: { title: true } },
          branch: { select: { name: true } },
        },
      }),
    ]);

    // Format status map
    const statusCounts: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      SCHEDULED: 0,
      ATTENDED: 0,
      CONVERTED: 0,
      CANCELLED: 0,
      SPAM: 0,
    };
    for (const item of leadsByStatusRaw) {
      statusCounts[item.status] = item._count._all;
    }

    // Conversion rate: CONVERTED / (total - SPAM - CANCELLED)
    const validDenominator = totalLeads - (statusCounts.SPAM || 0) - (statusCounts.CANCELLED || 0);
    const convertedCount = statusCounts.CONVERTED || 0;
    const conversionRatePercent = validDenominator > 0
      ? Number(((convertedCount / validDenominator) * 100).toFixed(1))
      : 0;

    // Map course titles
    const courses = await this.prisma.course.findMany({
      select: { id: true, title: true },
    });
    const courseTitleMap = new Map(courses.map((c) => [c.id, c.title]));
    const registrationsByCourse = leadsByCourseRaw.map((item) => ({
      courseId: item.courseId,
      courseTitle: courseTitleMap.get(item.courseId) || 'Noma’lum kurs',
      count: item._count._all,
    }));

    // Map branch names
    const branches = await this.prisma.branch.findMany({
      select: { id: true, name: true },
    });
    const branchNameMap = new Map(branches.map((b) => [b.id, b.name]));
    const registrationsByBranch = leadsByBranchRaw.map((item) => ({
      branchId: item.branchId,
      branchName: branchNameMap.get(item.branchId) || 'Noma’lum filial',
      count: item._count._all,
    }));

    // Last 30 days daily registration trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const trendRaw = await this.prisma.trialRegistration.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyTrendMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyTrendMap[key] = 0;
    }

    for (const r of trendRaw) {
      const key = r.createdAt.toISOString().split('T')[0];
      if (dailyTrendMap[key] !== undefined) {
        dailyTrendMap[key]++;
      }
    }

    const dailyTrend = Object.entries(dailyTrendMap).map(([date, count]) => ({ date, count }));

    return {
      summary: {
        totalLeads,
        todayLeads,
        convertedCount,
        conversionRatePercent,
      },
      statusCounts,
      registrationsByCourse,
      registrationsByBranch,
      dailyTrend,
      recentLeads,
    };
  }
}
