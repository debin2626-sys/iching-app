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
  const path = `${locale === 'zh' ? '' : locale + '/'}guide/how-to-divine`;
  const canonical = `https://51yijing.com/${path}`;

  const title = isEn
    ? 'How to Cast a Hexagram — I Ching Divination Methods | 51yijing.com'
    : '如何起卦？— 易经占卜方法详解 | 51yijing.com';
  const description = isEn
    ? 'Step-by-step guide to I Ching divination: the three-coin method, yarrow stalk method, and modern AI-assisted casting. Start your first reading today.'
    : '详细讲解易经起卦方法：三枚铜钱法、蓍草法和现代AI辅助起卦。今天就开始你的第一次占卜。';

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateLanguages('/guide/how-to-divine') },
    openGraph: { title, description, url: canonical, type: 'article' },
  };
}

export default async function HowToDivine({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  return (
    <GuideArticleLayout locale={locale} slug="how-to-divine">
      {isEn ? <EnContent locale={locale} /> : isZhTW ? <ZhTWContent locale={locale} /> : <ZhContent locale={locale} />}
    </GuideArticleLayout>
  );
}

function ZhContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        起卦是易经占卜的第一步。无论使用哪种方法，核心都是通过随机过程生成六条爻线，组成一个卦象。下面介绍几种常见的起卦方法。
      </p>

      <h2>起卦前的准备</h2>
      <p>
        占卜不是随意的游戏，而是一次与内心的对话。起卦前建议：
      </p>
      <ul>
        <li>找一个安静的环境，让心情平静下来</li>
        <li>明确你想问的问题 — 越具体越好</li>
        <li>保持开放的心态，不要预设答案</li>
        <li>同一个问题不要反复占卜</li>
      </ul>

      <h2>方法一：三枚铜钱法（最常用）</h2>
      <p>
        这是最流行的起卦方法，简单易学，只需要三枚硬币。
      </p>
      <h3>步骤</h3>
      <ol>
        <li>准备三枚相同的硬币（铜钱或普通硬币均可）</li>
        <li>双手合拢握住硬币，心中默念你的问题</li>
        <li>将三枚硬币同时抛出，记录结果</li>
        <li>重复六次，从下到上依次记录每一爻</li>
      </ol>

      <h3>如何判断爻线</h3>
      <p>
        规定正面（有字）为 3，反面（无字）为 2。三枚硬币的数值之和决定爻线类型：
      </p>
      <ul>
        <li><strong>6（三个反面）</strong>→ 老阴 ⚋✦ — 阴爻，且为变爻</li>
        <li><strong>7（两反一正）</strong>→ 少阳 ⚊ — 阳爻，不变</li>
        <li><strong>8（两正一反）</strong>→ 少阴 ⚋ — 阴爻，不变</li>
        <li><strong>9（三个正面）</strong>→ 老阳 ⚊✦ — 阳爻，且为变爻</li>
      </ul>

      <h2>方法二：蓍草法（传统）</h2>
      <p>
        这是《易经》原典记载的方法，使用50根蓍草（或竹签），过程较为复杂，需要经过「分二、挂一、揲四、归奇」四个步骤，每一爻需要操作三次。虽然繁琐，但被认为是最正统的起卦方式。
      </p>

      <h2>方法三：AI 辅助起卦（推荐新手）</h2>
      <p>
        现代技术让起卦变得更加便捷。在 51yijing.com，你只需要：
      </p>
      <ol>
        <li>输入你的问题</li>
        <li>点击「开始占卜」</li>
        <li>系统使用密码学安全的随机数生成卦象</li>
        <li>AI 结合你的问题，给出个性化的卦象解读</li>
      </ol>
      <p>
        AI 起卦的随机性与铜钱法在数学上是等价的，同时还能提供更深入的解读分析。
      </p>

      <blockquote>
        <p>「善易者不占」— 真正精通易经的人，在日常生活中就能体悟变化之道。但对于初学者，占卜是最好的入门方式。</p>
      </blockquote>

      <h2>得到卦象之后</h2>
      <p>
        起卦完成后，你会得到一个「本卦」。如果有变爻（老阴或老阳），变爻变化后还会得到一个「变卦」。解读时需要综合考虑本卦、变卦和变爻的含义。
      </p>
      <p>
        想了解变爻的具体含义？请继续阅读<Link href={`/${locale}/guide/changing-lines`}>如何看变爻</Link>。
      </p>
      <p>
        或者，现在就<Link href={`/${locale}/divine`}>开始你的第一次占卜</Link>吧！
      </p>
    </>
  );
}

function ZhTWContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        起卦是易經占卜的第一步。無論使用哪種方法，核心都是通過隨機過程生成六條爻線，組成一個卦象。下面介紹幾種常見的起卦方法。
      </p>

      <h2>起卦前的準備</h2>
      <p>
        占卜不是隨意的遊戲，而是一次與內心的對話。起卦前建議：
      </p>
      <ul>
        <li>找一個安靜的環境，讓心情平靜下來</li>
        <li>明確你想問的問題 — 越具體越好</li>
        <li>保持開放的心態，不要預設答案</li>
        <li>同一個問題不要反覆占卜</li>
      </ul>

      <h2>方法一：三枚銅錢法（最常用）</h2>
      <p>
        這是最流行的起卦方法，簡單易學，只需要三枚硬幣。
      </p>
      <h3>步驟</h3>
      <ol>
        <li>準備三枚相同的硬幣（銅錢或普通硬幣均可）</li>
        <li>雙手合攏握住硬幣，心中默念你的問題</li>
        <li>將三枚硬幣同時拋出，記錄結果</li>
        <li>重複六次，從下到上依次記錄每一爻</li>
      </ol>

      <h3>如何判斷爻線</h3>
      <p>
        規定正面（有字）為 3，反面（無字）為 2。三枚硬幣的數值之和決定爻線類型：
      </p>
      <ul>
        <li><strong>6（三個反面）</strong>→ 老陰 ⚋✦ — 陰爻，且為變爻</li>
        <li><strong>7（兩反一正）</strong>→ 少陽 ⚊ — 陽爻，不變</li>
        <li><strong>8（兩正一反）</strong>→ 少陰 ⚋ — 陰爻，不變</li>
        <li><strong>9（三個正面）</strong>→ 老陽 ⚊✦ — 陽爻，且為變爻</li>
      </ul>

      <h2>方法二：蓍草法（傳統）</h2>
      <p>
        這是《易經》原典記載的方法，使用50根蓍草（或竹籤），過程較為複雜，需要經過「分二、掛一、揲四、歸奇」四個步驟，每一爻需要操作三次。雖然繁瑣，但被認為是最正統的起卦方式。
      </p>

      <h2>方法三：AI 輔助起卦（推薦新手）</h2>
      <p>
        現代技術讓起卦變得更加便捷。在 51yijing.com，你只需要：
      </p>
      <ol>
        <li>輸入你的問題</li>
        <li>點擊「開始占卜」</li>
        <li>系統使用密碼學安全的隨機數生成卦象</li>
        <li>AI 結合你的問題，給出個性化的卦象解讀</li>
      </ol>
      <p>
        AI 起卦的隨機性與銅錢法在數學上是等價的，同時還能提供更深入的解讀分析。
      </p>

      <blockquote>
        <p>「善易者不占」— 真正精通易經的人，在日常生活中就能體悟變化之道。但對於初學者，占卜是最好的入門方式。</p>
      </blockquote>

      <h2>得到卦象之後</h2>
      <p>
        起卦完成後，你會得到一個「本卦」。如果有變爻（老陰或老陽），變爻變化後還會得到一個「變卦」。解讀時需要綜合考慮本卦、變卦和變爻的含義。
      </p>
      <p>
        想了解變爻的具體含義？請繼續閱讀<Link href={`/${locale}/guide/changing-lines`}>如何看變爻</Link>。
      </p>
      <p>
        或者，現在就<Link href={`/${locale}/divine`}>開始你的第一次占卜</Link>吧！
      </p>
    </>
  );
}

function EnContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        Casting a hexagram is the first step in I Ching divination. Regardless of the method, the goal is to generate six lines through a random process to form a hexagram. Here are the most common methods.
      </p>

      <h2>Before You Begin</h2>
      <p>
        Divination is not a casual game — it&apos;s a dialogue with your inner self. Before casting:
      </p>
      <ul>
        <li>Find a quiet space and calm your mind</li>
        <li>Formulate a clear, specific question</li>
        <li>Stay open-minded — don&apos;t assume the answer</li>
        <li>Don&apos;t ask the same question repeatedly</li>
      </ul>

      <h2>Method 1: Three-Coin Method (Most Popular)</h2>
      <p>
        The simplest and most widely used method. All you need is three identical coins.
      </p>
      <h3>Steps</h3>
      <ol>
        <li>Hold three coins in both hands</li>
        <li>Focus on your question</li>
        <li>Toss all three coins and record the result</li>
        <li>Repeat six times — record each line from bottom to top</li>
      </ol>

      <h3>Reading the Lines</h3>
      <p>
        Assign heads = 3, tails = 2. The sum of three coins determines the line type:
      </p>
      <ul>
        <li><strong>6 (three tails)</strong> → Old Yin ⚋✦ — yin line, changing</li>
        <li><strong>7 (two tails, one head)</strong> → Young Yang ⚊ — yang line, stable</li>
        <li><strong>8 (two heads, one tail)</strong> → Young Yin ⚋ — yin line, stable</li>
        <li><strong>9 (three heads)</strong> → Old Yang ⚊✦ — yang line, changing</li>
      </ul>

      <h2>Method 2: Yarrow Stalk Method (Traditional)</h2>
      <p>
        The original method described in the I Ching uses 50 yarrow stalks. It involves four operations — &quot;divide, suspend, count by fours, gather remainders&quot; — repeated three times per line. While complex, it&apos;s considered the most authentic approach.
      </p>

      <h2>Method 3: AI-Assisted Casting (Recommended for Beginners)</h2>
      <p>
        Modern technology makes divination accessible to everyone. On 51yijing.com:
      </p>
      <ol>
        <li>Type your question</li>
        <li>Click &quot;Start Divination&quot;</li>
        <li>The system generates a hexagram using cryptographically secure randomness</li>
        <li>AI provides a personalized interpretation based on your question</li>
      </ol>
      <p>
        The randomness of AI casting is mathematically equivalent to the coin method, with the added benefit of deeper, contextual analysis.
      </p>

      <blockquote>
        <p>&quot;The master of the I Ching does not divine&quot; — true mastery means perceiving change in everyday life. But for beginners, divination is the best way to start.</p>
      </blockquote>

      <h2>After Getting Your Hexagram</h2>
      <p>
        After casting, you&apos;ll get a &quot;primary hexagram.&quot; If there are changing lines (old yin or old yang), those lines transform to produce a &quot;relating hexagram.&quot; Interpretation considers both hexagrams and the changing lines.
      </p>
      <p>
        Want to understand changing lines? Continue to <Link href={`/${locale}/guide/changing-lines`}>How to Read Changing Lines</Link>.
      </p>
      <p>
        Or <Link href={`/${locale}/divine`}>start your first divination</Link> right now!
      </p>
    </>
  );
}
