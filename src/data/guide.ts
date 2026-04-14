import { BookOpen, Coins, ArrowRightLeft } from 'lucide-react';

export const GUIDE_SLUGS = ['what-is-iching', 'how-to-divine', 'changing-lines'] as const;
export type GuideSlug = typeof GUIDE_SLUGS[number];

export interface GuideMeta {
  slug: GuideSlug;
  titleZh: string;
  titleEn: string;
  titleZhTW: string;
  descZh: string;
  descEn: string;
  descZhTW: string;
  icon: typeof BookOpen;
  color: string;
  bgColor: string;
}

export const GUIDE_ARTICLES: GuideMeta[] = [
  {
    slug: 'what-is-iching',
    titleZh: '什么是易经',
    titleEn: 'What is the I Ching?',
    titleZhTW: '什麼是易經',
    descZh: '三千年智慧经典，从入门到理解核心概念',
    descEn: '3,000 years of wisdom — from basics to core concepts',
    descZhTW: '三千年智慧經典，從入門到理解核心概念',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    slug: 'how-to-divine',
    titleZh: '如何起卦',
    titleEn: 'How to Cast a Hexagram',
    titleZhTW: '如何起卦',
    descZh: '三币法、心诚则灵，一步步教你起卦',
    descEn: 'The three-coin method — step by step guide',
    descZhTW: '三幣法、心誠則靈，一步步教你起卦',
    icon: Coins,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    slug: 'changing-lines',
    titleZh: '如何看变爻',
    titleEn: 'Understanding Changing Lines',
    titleZhTW: '如何看變爻',
    descZh: '变爻是什么、怎么看、对卦象有什么影响',
    descEn: 'What changing lines mean and how they transform hexagrams',
    descZhTW: '變爻是什麼、怎麼看、對卦象有什麼影響',
    icon: ArrowRightLeft,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
];
