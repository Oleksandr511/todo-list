import { useEffect, useState, type RefObject } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export const useDraggableCard = (
  ref: RefObject<HTMLDivElement | null>,
  taskId: string,
  columnId: string,
) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({
        type: "card" as const,
        taskId,
        columnId,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [ref, taskId, columnId]);

  return { isDragging };
};
