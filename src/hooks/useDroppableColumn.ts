import { useEffect, useState, type RefObject } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

export const useDroppableColumn = (
  ref: RefObject<HTMLDivElement | null>,
  columnId: string,
) => {
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) =>
        attachClosestEdge(
          { type: 'column', columnId },
          { input, element, allowedEdges: ['left', 'right'] }
        ),
      onDrag: ({ self, source }) => {
        if (source.data.type === 'column') {
          setClosestEdge(extractClosestEdge(self.data));
        }
        setIsDragOver(true);
      },
      onDragLeave: () => {
        setClosestEdge(null);
        setIsDragOver(false);
      },
      onDrop: () => {
        setClosestEdge(null);
        setIsDragOver(false);
      },
    });
  }, [ref, columnId]);

  return { closestEdge, isDragOver };
}
