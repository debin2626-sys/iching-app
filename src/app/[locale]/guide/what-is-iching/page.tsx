import type { Metadata } from 'next';
import Link from 'next/link';
import { getAlternateLanguages } from '@/lib/seo';
import { GuideArticleLayout } from '@/components/guide/GuideArticleLayout';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const path = `${locale === 'zh' ? '' : locale + '/'}guide/what-is-iching`;
  const canonical = `https://51yijing.com/${path}`;

  const title = isEn
    ? 'What is the I Ching? — Beginner Guide | 51yijing.com'
    : '什么是易经？— 易经入门指南 | 51yijing.com';
  const description = isEn
    ? 'Learn the basics of the I Ching (Yi Jing): its 3,000-year history, 64 hexagrams, yin-yang philosophy, and how it can guide your life decisions.'
    : '了解易经的基础知识：三千年历史、六十四卦、阴阳哲学，以及它如何指引你的人生决策。';

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateLanguages('/guide/what-is-iching') },
    openGraph: { title, description, url: canonical, type: 'article' },
  };
}

export default async function WhatIsIChing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  return (
    <GuideArticleLayout locale={locale} slug="what-is-iching">
      {isEn ? <EnContent locale={locale} /> : isZhTW ? <ZhTWContent locale={locale} /> : <ZhContent locale={locale} />}
    </GuideArticleLayout>
  );
}

function ZhContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        《易经》，又称《周易》，是中国最古老的经典之一，距今已有三千多年的历史。它不仅是一部占卜之书，更是一部蕴含深刻哲学思想的智慧宝典。
      </p>

      <h2>易经的起源</h2>
      <p>
        相传伏羲观天地万物，创造了八卦；周文王被囚羑里时，将八卦两两相叠，演绎出六十四卦，并撰写了卦辞。后来孔子为其作传，形成了我们今天看到的《易经》。
      </p>

      <h2>核心概念</h2>

      <h3>阴阳</h3>
      <p>
        易经的基础是阴阳二元论。阳（⚊）代表刚健、光明、积极；阴（⚋）代表柔顺、幽暗、消极。万事万物都是阴阳交互作用的结果。
      </p>

      <h3>八卦</h3>
      <p>
        八卦是由三条爻线组成的符号，分别代表天、地、水、火、雷、风、山、泽八种自然现象。它们是：乾☰、坤☷、坎☵、离☲、震☳、巽☴、艮☶、兑☱。
      </p>

      <h3>六十四卦</h3>
      <p>
        将两个八卦上下叠合，就得到六十四卦。每一卦由六条爻线组成，从下到上分别称为初爻、二爻、三爻、四爻、五爻、上爻。六十四卦涵盖了人生的各种境遇和变化。
      </p>
      <p>
        你可以在我们的<Link href={`/${locale}/hexagrams`}>卦象大全</Link>中浏览全部六十四卦。
      </p>

      <h2>易经能做什么？</h2>
      <p>易经的应用远不止占卜：</p>
      <ul>
        <li><strong>决策参考</strong> — 面对人生重大选择时，提供多角度的思考框架</li>
        <li><strong>自我反省</strong> — 通过卦象映射内心，帮助认识自己</li>
        <li><strong>趋势判断</strong> — 理解事物发展的规律和阶段</li>
        <li><strong>修身养性</strong> — 学习天地之道，培养处世智慧</li>
      </ul>

      <blockquote>
        <p>「天行健，君子以自强不息；地势坤，君子以厚德载物。」— 《易经·乾坤二卦》</p>
      </blockquote>

      <h2>下一步</h2>
      <p>
        了解了易经的基本概念后，接下来学习<Link href={`/${locale}/guide/how-to-divine`}>如何起卦</Link>，亲自体验易经的智慧。
      </p>
    </>
  );
}

function ZhTWContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        《易經》，又稱《周易》，是中國最古老的經典之一，距今已有三千多年的歷史。它不僅是一部占卜之書，更是一部蘊含深刻哲學思想的智慧寶典。
      </p>

      <h2>易經的起源</h2>
      <p>
        相傳伏羲觀天地萬物，創造了八卦；周文王被囚羑里時，將八卦兩兩相疊，演繹出六十四卦，並撰寫了卦辭。後來孔子為其作傳，形成了我們今天看到的《易經》。
      </p>

      <h2>核心概念</h2>

      <h3>陰陽</h3>
      <p>
        易經的基礎是陰陽二元論。陽（⚊）代表剛健、光明、積極；陰（⚋）代表柔順、幽暗、消極。萬事萬物都是陰陽交互作用的結果。
      </p>

      <h3>八卦</h3>
      <p>
        八卦是由三條爻線組成的符號，分別代表天、地、水、火、雷、風、山、澤八種自然現象。它們是：乾☰、坤☷、坎☵、離☲、震☳、巽☴、艮☶、兌☱。
      </p>

      <h3>六十四卦</h3>
      <p>
        將兩個八卦上下疊合，就得到六十四卦。每一卦由六條爻線組成，從下到上分別稱為初爻、二爻、三爻、四爻、五爻、上爻。六十四卦涵蓋了人生的各種境遇和變化。
      </p>
      <p>
        你可以在我們的<Link href={`/${locale}/hexagrams`}>卦象大全</Link>中瀏覽全部六十四卦。
      </p>

      <h2>易經能做什麼？</h2>
      <p>易經的應用遠不止占卜：</p>
      <ul>
        <li><strong>決策參考</strong> — 面對人生重大選擇時，提供多角度的思考框架</li>
        <li><strong>自我反省</strong> — 通過卦象映射內心，幫助認識自己</li>
        <li><strong>趨勢判斷</strong> — 理解事物發展的規律和階段</li>
        <li><strong>修身養性</strong> — 學習天地之道，培養處世智慧</li>
      </ul>

      <blockquote>
        <p>「天行健，君子以自強不息；地勢坤，君子以厚德載物。」— 《易經·乾坤二卦》</p>
      </blockquote>

      <h2>下一步</h2>
      <p>
        了解了易經的基本概念後，接下來學習<Link href={`/${locale}/guide/how-to-divine`}>如何起卦</Link>，親自體驗易經的智慧。
      </p>
    </>
  );
}

function EnContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        The I Ching (易经, also known as the Book of Changes) is one of the oldest Chinese classics, with over 3,000 years of history. It is both a divination system and a profound philosophical text that has influenced Chinese thought for millennia.
      </p>

      <h2>Origins</h2>
      <p>
        Legend says that Fu Xi observed nature and created the eight trigrams. King Wen of Zhou, while imprisoned, combined them into 64 hexagrams and wrote the judgments. Confucius later added commentaries, forming the I Ching we know today.
      </p>

      <h2>Core Concepts</h2>

      <h3>Yin and Yang</h3>
      <p>
        The foundation of the I Ching is the duality of yin and yang. Yang (⚊) represents strength, light, and activity. Yin (⚋) represents receptivity, darkness, and stillness. Everything in the universe arises from their interaction.
      </p>

      <h3>The Eight Trigrams</h3>
      <p>
        Trigrams are three-line symbols representing eight natural phenomena: heaven ☰, earth ☷, water ☵, fire ☲, thunder ☳, wind ☴, mountain ☶, and lake ☱.
      </p>

      <h3>The 64 Hexagrams</h3>
      <p>
        Stacking two trigrams creates a hexagram — six lines read from bottom to top. The 64 hexagrams cover every situation and transformation in human experience.
      </p>
      <p>
        Browse all 64 hexagrams in our <Link href={`/${locale}/hexagrams`}>hexagram encyclopedia</Link>.
      </p>

      <h2>What Can the I Ching Do?</h2>
      <p>The I Ching goes far beyond fortune-telling:</p>
      <ul>
        <li><strong>Decision support</strong> — a multi-perspective framework for life choices</li>
        <li><strong>Self-reflection</strong> — hexagrams mirror your inner state</li>
        <li><strong>Trend awareness</strong> — understand cycles and phases of change</li>
        <li><strong>Personal growth</strong> — learn the way of heaven and earth</li>
      </ul>

      <blockquote>
        <p>&quot;Heaven moves with vigor; the superior person strives ceaselessly.&quot; — Hexagram 1, Qian</p>
      </blockquote>

      <h2>Next Step</h2>
      <p>
        Now that you understand the basics, learn <Link href={`/${locale}/guide/how-to-divine`}>how to cast a hexagram</Link> and experience the I Ching firsthand.
      </p>
    </>
  );
}
