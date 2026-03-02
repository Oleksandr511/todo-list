import { useEffect, useCallback } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useBoardStore } from "../../store";

export const useWorkspace = () => {
  const columns = useBoardStore((s) => s.columns);
  const moveTask = useBoardStore((s) => s.moveTask);
  const reorderTask = useBoardStore((s) => s.reorderTask);
  const reorderColumn = useBoardStore((s) => s.reorderColumn);

  const handleDrop = useCallback(
    ({
      source,
      location,
    }: {
      source: { data: Record<string, unknown> };
      location: {
        current: { dropTargets: { data: Record<string, unknown> }[] };
      };
    }) => {
      const target = location.current.dropTargets[0];
      if (!target) return;

      const sourceData = source.data;
      const targetData = target.data;
      const edge = extractClosestEdge(targetData);

      if (sourceData.type === "card" && targetData.type === "card") {
        const sourceTaskId = sourceData.taskId as string;
        const sourceColumnId = sourceData.columnId as string;
        const targetTaskId = targetData.taskId as string;

        const state = useBoardStore.getState();
        let targetColumnId = "";
        let targetIndex = 0;

        for (const col of state.columns) {
          const idx = col.taskIds.indexOf(targetTaskId);
          if (idx !== -1) {
            targetColumnId = col.id;
            targetIndex = edge === "bottom" ? idx + 1 : idx;
            break;
          }
        }

        if (!targetColumnId) return;

        // Same column = reorder, different column = move
        if (sourceColumnId === targetColumnId) {
          reorderTask(sourceTaskId, targetColumnId, targetIndex);
        } else {
          moveTask(sourceTaskId, sourceColumnId, targetColumnId, targetIndex);
        }
      }

      // Column dropped on another column - reorder columns
      if (sourceData.type === "column" && targetData.type === "column") {
        const sourceColumnId = sourceData.columnId as string;
        const targetColumnId = targetData.columnId as string;

        if (sourceColumnId === targetColumnId) return;

        const state = useBoardStore.getState();
        const targetIdx = state.columns.findIndex(
          (c) => c.id === targetColumnId,
        );
        const toIndex = edge === "right" ? targetIdx + 1 : targetIdx;

        reorderColumn(sourceColumnId, toIndex);
      }

      if (sourceData.type === "card" && targetData.type === "column") {
        const sourceTaskId = sourceData.taskId as string;
        const sourceColumnId = sourceData.columnId as string;
        const targetColumnId = targetData.columnId as string;

        const state = useBoardStore.getState();
        const targetCol = state.columns.find((c) => c.id === targetColumnId);
        if (!targetCol) return;

        if (sourceColumnId === targetColumnId) return;

        moveTask(
          sourceTaskId,
          sourceColumnId,
          targetColumnId,
          targetCol.taskIds.length,
        );
      }
    },
    [moveTask, reorderTask, reorderColumn],
  );

  useEffect(() => {
    return monitorForElements({ onDrop: handleDrop });
  }, [handleDrop]);

  return { columns };
};
