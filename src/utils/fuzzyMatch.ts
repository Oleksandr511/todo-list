export interface FuzzyResult {
  matches: boolean;
  matchedSubstring?: string;
}

export const fuzzyMatch = (text: string, query: string): FuzzyResult => {
  if (!query) return { matches: true };

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const matches = lower.includes(q);

  return { matches, matchedSubstring: matches ? q : undefined };
};

export const getHighlightRanges = (
  text: string,
  query: string,
): { start: number; end: number }[] => {
  if (!query) return [];

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const ranges: { start: number; end: number }[] = [];
  let pos = 0;

  while (pos < lower.length) {
    const idx = lower.indexOf(q, pos);
    if (idx === -1) break;
    ranges.push({ start: idx, end: idx + q.length });
    pos = idx + 1;
  }

  return ranges;
};
