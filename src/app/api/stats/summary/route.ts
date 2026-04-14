import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // ISR 1小时

export async function GET() {
  const [total, todayResult] = await Promise.all([
    prisma.divination.count(),
    prisma.divination.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  return NextResponse.json({ total, today: todayResult });
}
