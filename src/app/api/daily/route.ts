import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDayIndex, getLunarDateInfo, type School } from '@/lib/daily-lesson'

/**
 * GET /api/daily?school=yijing&date=2026-05-01
 * 返回当日日课内容 + 农历信息
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const school = (searchParams.get('school') ?? 'yijing') as School
  const dateStr = searchParams.get('date')

  if (school !== 'yijing' && school !== 'daoist') {
    return NextResponse.json(
      { error: 'Invalid school. Use "yijing" or "daoist".' },
      { status: 400 }
    )
  }

  const date = dateStr ? new Date(dateStr + 'T12:00:00+08:00') : new Date()
  const result = getDayIndex(date, school)

  if (result.status === 'not_launched') {
    const lunar = getLunarDateInfo(date)
    return NextResponse.json({
      status: 'not_launched',
      launchDate: result.launchDate,
      lunar,
    })
  }

  try {
    const lesson = await prisma.dailyLesson.findFirst({
      where: { school, dayIndex: result.dayIndex, locale: 'zh' },
      include: { hexagram: school === 'yijing' ? { select: { number: true, nameZh: true, nature: true } } : false },
    })

    if (!lesson) {
      return NextResponse.json({
        status: 'active',
        dayIndex: result.dayIndex,
        school,
        lesson: null,
        lunar: getLunarDateInfo(date),
        message: 'Content not yet available for this day.',
      })
    }

    return NextResponse.json({
      status: 'active',
      dayIndex: result.dayIndex,
      school,
      lesson: {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        subtitle: lesson.subtitle,
        classicText: lesson.classicText,
        wisdom: lesson.wisdom,
        action: lesson.action,
        caution: lesson.caution,
        meditation: lesson.meditation,
        sourceRef: lesson.sourceRef,
        hexagram: lesson.hexagram,
      },
      lunar: getLunarDateInfo(date),
    })
  } catch (error) {
    console.error('[daily] DB error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
