import { memo, useMemo } from 'react';
import { getHighlightRanges } from '../../../utils';

interface HighlightedTextProps {
  text: string;
  query: string;
}

export const HighlightedText = memo(({
  text,
  query,
}: HighlightedTextProps) => {
  const parts = useMemo(() => {
    if (!query) return null;

    const ranges = getHighlightRanges(text, query);
    if (ranges.length === 0) return null;

    const result: React.ReactNode[] = [];
    let lastEnd = 0;

    for (const { start, end } of ranges) {
      if (start > lastEnd) {
        result.push(text.slice(lastEnd, start));
      }
      result.push(<mark key={start}>{text.slice(start, end)}</mark>);
      lastEnd = end;
    }

    if (lastEnd < text.length) {
      result.push(text.slice(lastEnd));
    }

    return result;
  }, [text, query]);

  if (!parts) return <>{text}</>;
  return <>{parts}</>;
});
