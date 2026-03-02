import { useRef, useMemo } from "react";
import { useBoardStore, useUIStore } from "../../store";
import { useDraggableColumn, useDroppableColumn } from "../../hooks";
import { fuzzyMatch } from "../../utils";

interface UseColumnProps {
  columnId: string;
}

export const useLane = ({ columnId }: UseColumnProps) => {
  const column = useBoardStore((s) => s.columns.find((c) => c.id === columnId));
  const tasks = useBoardStore((s) => s.tasks);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const filterStatus = useUIStore((s) => s.filterStatus);

  const columnRef = useRef<HTMLDivElement>(null);
  const { handleRef, isDragging } = useDraggableColumn(columnRef, columnId);
  const { closestEdge } = useDroppableColumn(columnRef, columnId);

  const filteredTaskIds = useMemo(() => {
    if (!column) return [];
    return column.taskIds.filter((id) => {
      const task = tasks[id];
      if (!task) return false;
      if (filterStatus === "completed" && !task.completed) return false;
      if (filterStatus === "incomplete" && task.completed) return false;
      if (searchQuery) return fuzzyMatch(task.text, searchQuery).matches;
      return true;
    });
  }, [column, tasks, filterStatus, searchQuery]);

  return {
    column,
    columnRef,
    handleRef,
    isDragging,
    closestEdge,
    filteredTaskIds,
    searchQuery,
    filterStatus,
  };
};
