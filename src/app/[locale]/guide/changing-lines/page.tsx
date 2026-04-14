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
  const path = `${locale === 'zh' ? '' : locale + '/'}guide/changing-lines`;
  const canonical = `https://51yijing.com/${path}`;

  const title = isEn
    ? 'How to Read Changing Lines — I Ching Guide | 51yijing.com'
    : '如何看变爻？— 易经变爻解读指南 | 51yijing.com';
  const description = isEn
    ? 'Master the art of reading changing lines (变爻) in I Ching divination. Learn the rules for interpreting 0, 1, 2, 3, or 6 changing lines in your hexagram.'
    : '掌握易经变爻的解读方法。学习0个、1个、2个、3个或6个变爻时的不同解读规则。';

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateLanguages('/guide/changing-lines') },
    openGraph: { title, description, url: canonical, type: 'article' },
  };
}

export default async function ChangingLines({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isZhTW = locale === 'zh-TW';

  return (
    <GuideArticleLayout locale={locale} slug="changing-lines">
      {isEn ? <EnContent locale={locale} /> : isZhTW ? <ZhTWContent locale={locale} /> : <ZhContent locale={locale} />}
    </GuideArticleLayout>
  );
}

function ZhContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        变爻是易经占卜中最精妙的部分。它揭示了事物正在发生的变化，是解读卦象的关键。如果你还不了解起卦方法，建议先阅读<Link href={`/${locale}/guide/how-to-divine`}>如何起卦</Link>。
      </p>

      <h2>什么是变爻？</h2>
      <p>
        在起卦过程中，如果三枚硬币的结果为 6（老阴）或 9（老阳），这条爻就是「变爻」。变爻代表正在发生转化的力量 — 阳极生阴，阴极生阳。
      </p>
      <ul>
        <li><strong>老阳（9）</strong>→ 阳爻变为阴爻</li>
        <li><strong>老阴（6）</strong>→ 阴爻变为阳爻</li>
        <li><strong>少阳（7）、少阴（8）</strong>→ 不变</li>
      </ul>

      <h2>本卦与变卦</h2>
      <p>
        起卦得到的原始卦象叫「本卦」，代表当前的状态。将变爻翻转后得到的新卦叫「变卦」，代表事物发展的方向。
      </p>
      <p>
        例如：你得到「乾卦」☰☰，初爻为老阳（变爻），初爻由阳变阴后，下卦变为巽☴，得到变卦「小畜」☰☴。
      </p>

      <h2>变爻的解读规则</h2>
      <p>
        根据变爻的数量，解读方法有所不同。以下是朱熹在《易学启蒙》中总结的经典规则：
      </p>

      <h3>无变爻（0个）</h3>
      <p>
        六条爻都不变，只看本卦的卦辞。这种情况表示局势稳定，按照本卦的整体含义来理解。
      </p>

      <h3>一个变爻</h3>
      <p>
        这是最常见也最清晰的情况。<strong>重点看本卦中变爻的爻辞</strong>，它直接回答你的问题。变卦作为辅助参考，指示发展方向。
      </p>

      <h3>两个变爻</h3>
      <p>
        以本卦两条变爻的爻辞为主，<strong>上面那条变爻的爻辞更为重要</strong>。同时参考变卦的整体趋势。
      </p>

      <h3>三个变爻</h3>
      <p>
        本卦和变卦的卦辞都要看。<strong>本卦卦辞为体（当前），变卦卦辞为用（趋势）</strong>。三个变爻意味着变化剧烈，需要特别注意。
      </p>

      <h3>四个变爻</h3>
      <p>
        以变卦中两条不变的爻辞为主，<strong>下面那条不变爻的爻辞更为重要</strong>。
      </p>

      <h3>五个变爻</h3>
      <p>
        以变卦中唯一不变的那条爻辞为主。
      </p>

      <h3>六个变爻（全变）</h3>
      <p>
        乾卦全变看「用九」，坤卦全变看「用六」。其他卦全变则看变卦的卦辞。六爻全变是极为罕见的情况，代表彻底的转变。
      </p>

      <h2>实际解读示例</h2>
      <p>
        假设你问「是否应该换工作」，得到：
      </p>
      <ul>
        <li>本卦：屯卦（水雷屯）☵☳ — 万事开头难</li>
        <li>第二爻为变爻（老阴→阳）</li>
        <li>变卦：节卦（水泽节）☵☱ — 适度节制</li>
      </ul>
      <p>
        解读重点看屯卦二爻爻辞：「屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。」意思是虽然眼前困难重重，但这不是威胁而是机遇，需要耐心等待合适的时机。变卦「节」提示要把握分寸，不宜操之过急。
      </p>

      <h2>小贴士</h2>
      <ul>
        <li>变爻越少，信息越聚焦，解读越清晰</li>
        <li>不要过度解读 — 抓住核心信息即可</li>
        <li>结合自己的实际情况理解卦象，不要生搬硬套</li>
        <li>多练习，直觉会越来越准</li>
      </ul>

      <h2>开始实践</h2>
      <p>
        理论学完了，最好的学习方式就是实践。现在就<Link href={`/${locale}/divine`}>开始占卜</Link>，用 AI 帮你解读变爻的含义吧！
      </p>
      <p>
        想复习基础知识？回到<Link href={`/${locale}/guide/what-is-iching`}>什么是易经</Link>。
      </p>
    </>
  );
}

function ZhTWContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        變爻是易經占卜中最精妙的部分。它揭示了事物正在發生的變化，是解讀卦象的關鍵。如果你還不了解起卦方法，建議先閱讀<Link href={`/${locale}/guide/how-to-divine`}>如何起卦</Link>。
      </p>

      <h2>什麼是變爻？</h2>
      <p>
        在起卦過程中，如果三枚硬幣的結果為 6（老陰）或 9（老陽），這條爻就是「變爻」。變爻代表正在發生轉化的力量 — 陽極生陰，陰極生陽。
      </p>
      <ul>
        <li><strong>老陽（9）</strong>→ 陽爻變為陰爻</li>
        <li><strong>老陰（6）</strong>→ 陰爻變為陽爻</li>
        <li><strong>少陽（7）、少陰（8）</strong>→ 不變</li>
      </ul>

      <h2>本卦與變卦</h2>
      <p>
        起卦得到的原始卦象叫「本卦」，代表當前的狀態。將變爻翻轉後得到的新卦叫「變卦」，代表事物發展的方向。
      </p>
      <p>
        例如：你得到「乾卦」☰☰，初爻為老陽（變爻），初爻由陽變陰後，下卦變為巽☴，得到變卦「小畜」☰☴。
      </p>

      <h2>變爻的解讀規則</h2>
      <p>
        根據變爻的數量，解讀方法有所不同。以下是朱熹在《易學啟蒙》中總結的經典規則：
      </p>

      <h3>無變爻（0個）</h3>
      <p>
        六條爻都不變，只看本卦的卦辭。這種情況表示局勢穩定，按照本卦的整體含義來理解。
      </p>

      <h3>一個變爻</h3>
      <p>
        這是最常見也最清晰的情況。<strong>重點看本卦中變爻的爻辭</strong>，它直接回答你的問題。變卦作為輔助參考，指示發展方向。
      </p>

      <h3>兩個變爻</h3>
      <p>
        以本卦兩條變爻的爻辭為主，<strong>上面那條變爻的爻辭更為重要</strong>。同時參考變卦的整體趨勢。
      </p>

      <h3>三個變爻</h3>
      <p>
        本卦和變卦的卦辭都要看。<strong>本卦卦辭為體（當前），變卦卦辭為用（趨勢）</strong>。三個變爻意味著變化劇烈，需要特別注意。
      </p>

      <h3>四個變爻</h3>
      <p>
        以變卦中兩條不變的爻辭為主，<strong>下面那條不變爻的爻辭更為重要</strong>。
      </p>

      <h3>五個變爻</h3>
      <p>
        以變卦中唯一不變的那條爻辭為主。
      </p>

      <h3>六個變爻（全變）</h3>
      <p>
        乾卦全變看「用九」，坤卦全變看「用六」。其他卦全變則看變卦的卦辭。六爻全變是極為罕見的情況，代表徹底的轉變。
      </p>

      <h2>實際解讀示例</h2>
      <p>
        假設你問「是否應該換工作」，得到：
      </p>
      <ul>
        <li>本卦：屯卦（水雷屯）☵☳ — 萬事開頭難</li>
        <li>第二爻為變爻（老陰→陽）</li>
        <li>變卦：節卦（水澤節）☵☱ — 適度節制</li>
      </ul>
      <p>
        解讀重點看屯卦二爻爻辭：「屯如邅如，乘馬班如。匪寇婚媾，女子貞不字，十年乃字。」意思是雖然眼前困難重重，但這不是威脅而是機遇，需要耐心等待合適的時機。變卦「節」提示要把握分寸，不宜操之過急。
      </p>

      <h2>小貼士</h2>
      <ul>
        <li>變爻越少，信息越聚焦，解讀越清晰</li>
        <li>不要過度解讀 — 抓住核心信息即可</li>
        <li>結合自己的實際情況理解卦象，不要生搬硬套</li>
        <li>多練習，直覺會越來越準</li>
      </ul>

      <h2>開始實踐</h2>
      <p>
        理論學完了，最好的學習方式就是實踐。現在就<Link href={`/${locale}/divine`}>開始占卜</Link>，用 AI 幫你解讀變爻的含義吧！
      </p>
      <p>
        想複習基礎知識？回到<Link href={`/${locale}/guide/what-is-iching`}>什麼是易經</Link>。
      </p>
    </>
  );
}

function EnContent({ locale }: { locale: string }) {
  return (
    <>
      <p>
        Changing lines are the most nuanced part of I Ching divination. They reveal transformations in progress and are key to accurate interpretation. If you&apos;re not familiar with casting methods, start with <Link href={`/${locale}/guide/how-to-divine`}>How to Cast a Hexagram</Link>.
      </p>

      <h2>What Are Changing Lines?</h2>
      <p>
        When casting, if three coins sum to 6 (old yin) or 9 (old yang), that line is a &quot;changing line.&quot; Changing lines represent forces in transition — yang at its peak becomes yin, and vice versa.
      </p>
      <ul>
        <li><strong>Old Yang (9)</strong> → yang line transforms to yin</li>
        <li><strong>Old Yin (6)</strong> → yin line transforms to yang</li>
        <li><strong>Young Yang (7), Young Yin (8)</strong> → stable, no change</li>
      </ul>

      <h2>Primary and Relating Hexagrams</h2>
      <p>
        The original hexagram is the &quot;primary hexagram&quot; — your current situation. After flipping the changing lines, you get the &quot;relating hexagram&quot; — where things are heading.
      </p>
      <p>
        Example: You cast Qian ☰☰ (The Creative) with the first line as old yang. The first line changes from yang to yin, making the lower trigram Xun ☴, giving you Xiao Xu ☰☴ (Small Accumulation) as the relating hexagram.
      </p>

      <h2>Interpretation Rules by Number of Changing Lines</h2>
      <p>
        The method of interpretation depends on how many changing lines appear. These classic rules come from Zhu Xi&apos;s &quot;Introduction to the Study of the I Ching&quot;:
      </p>

      <h3>No Changing Lines (0)</h3>
      <p>
        All six lines are stable. Read only the primary hexagram&apos;s judgment. The situation is steady — interpret the hexagram as a whole.
      </p>

      <h3>One Changing Line</h3>
      <p>
        The most common and clearest case. <strong>Focus on the changing line&apos;s text in the primary hexagram</strong> — it directly answers your question. The relating hexagram shows the direction of development.
      </p>

      <h3>Two Changing Lines</h3>
      <p>
        Read both changing lines&apos; texts in the primary hexagram. <strong>The upper changing line carries more weight.</strong> Also consider the relating hexagram&apos;s overall meaning.
      </p>

      <h3>Three Changing Lines</h3>
      <p>
        Read both hexagrams&apos; judgments. <strong>The primary hexagram is the &quot;substance&quot; (present), the relating hexagram is the &quot;function&quot; (trend).</strong> Three changing lines signal significant transformation.
      </p>

      <h3>Four Changing Lines</h3>
      <p>
        Focus on the two stable lines in the relating hexagram. <strong>The lower stable line is more important.</strong>
      </p>

      <h3>Five Changing Lines</h3>
      <p>
        Read the single stable line&apos;s text in the relating hexagram.
      </p>

      <h3>Six Changing Lines (All Change)</h3>
      <p>
        For Qian (all yang), read &quot;Use of Nines.&quot; For Kun (all yin), read &quot;Use of Sixes.&quot; For other hexagrams, read the relating hexagram&apos;s judgment. All lines changing is extremely rare and signifies total transformation.
      </p>

      <h2>Practical Example</h2>
      <p>
        Suppose you ask &quot;Should I change jobs?&quot; and get:
      </p>
      <ul>
        <li>Primary: Hexagram 3, Zhun ☵☳ (Difficulty at the Beginning)</li>
        <li>Second line is changing (old yin → yang)</li>
        <li>Relating: Hexagram 60, Jie ☵☱ (Limitation)</li>
      </ul>
      <p>
        Focus on Zhun&apos;s second line text: &quot;Difficulty upon difficulty, horses and wagon turn back. Not a robber but a suitor — the maiden stays true, and after ten years she bears.&quot; The message: current difficulties are not threats but opportunities. Patience is needed. The relating hexagram Jie (Limitation) advises moderation — don&apos;t rush.
      </p>

      <h2>Tips</h2>
      <ul>
        <li>Fewer changing lines = more focused, clearer guidance</li>
        <li>Don&apos;t over-interpret — capture the core message</li>
        <li>Relate the hexagram to your actual situation, don&apos;t take it literally</li>
        <li>Practice regularly — your intuition will sharpen over time</li>
      </ul>

      <h2>Start Practicing</h2>
      <p>
        Theory is done — the best way to learn is by doing. <Link href={`/${locale}/divine`}>Start a divination</Link> now and let AI help you interpret the changing lines!
      </p>
      <p>
        Want to review the basics? Go back to <Link href={`/${locale}/guide/what-is-iching`}>What is the I Ching?</Link>
      </p>
    </>
  );
}
