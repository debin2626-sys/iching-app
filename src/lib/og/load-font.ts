/**
 * Load a subset of Noto Serif SC (Bold) from Google Fonts containing only
 * the characters we need. Returns TTF ArrayBuffer or null on failure.
 *
 * Uses the `text=` parameter so Google returns a tiny subset (~2-10 KB)
 * instead of the full 14 MB font.
 */
export async function loadNotoSerifSC(
  text: string
): Promise<ArrayBuffer | null> {
  try {
    // Request CSS with TTF format (old user-agent trick)
    const encoded = encodeURIComponent(text);
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&text=${encoded}&display=swap`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        // Old user-agent forces Google Fonts to return TTF instead of woff2
        'User-Agent': 'Java/1.8',
      },
    });
    if (!cssRes.ok) return null;

    const css = await cssRes.text();
    // Extract TTF URL from CSS: url(https://fonts.gstatic.com/...) format('truetype')
    const match = css.match(/url\(([^)]+\.ttf[^)]*)\)/);
    if (!match) {
      // Try generic url() match (sometimes no .ttf extension)
      const genericMatch = css.match(/url\(([^)]+)\)\s*format\(['"]truetype['"]\)/);
      if (!genericMatch) return null;
      const fontRes = await fetch(genericMatch[1]);
      if (!fontRes.ok) return null;
      return fontRes.arrayBuffer();
    }

    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return fontRes.arrayBuffer();
  } catch {
    return null;
  }
}
