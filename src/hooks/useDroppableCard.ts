import { useEffect, useState, type RefObject } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

export const useDroppableCard = (
  ref: RefObject<HTMLDivElement | null>,
  taskId: string,
) => {
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: ({ input, element }) =>
        attachClosestEdge(
          { type: 'card', taskId },
          { input, element, allowedEdges: ['top', 'bottom'] }
        ),
      canDrop: ({ source }) => source.data.type === 'card',
      onDrag: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data));
      },
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    });
  }, [ref, taskId]);

  return { closestEdge };
}
