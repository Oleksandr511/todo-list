import { useEffect, useRef, useState, type RefObject } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export const useDraggableColumn = (
  ref: RefObject<HTMLDivElement | null>,
  columnId: string,
) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      dragHandle: handleRef.current ?? undefined,
      getInitialData: () => ({
        type: 'column' as const,
        columnId,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [ref, columnId]);

  return { handleRef, isDragging };
}
