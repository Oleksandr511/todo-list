import { useState, useCallback, useMemo } from "react";
import { useBoardStore, useUIStore } from "../../store";

export const useSelectionBar = () => {
  const columns = useBoardStore((s) => s.columns);
  const removeTasks = useBoardStore((s) => s.removeTasks);
  const setTasksComplete = useBoardStore((s) => s.setTasksComplete);
  const moveTasksToColumn = useBoardStore((s) => s.moveTasksToColumn);

  const selectedTaskIds = useUIStore((s) => s.selectedTaskIds);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const ids = useMemo(() => Array.from(selectedTaskIds), [selectedTaskIds]);

  const handleDelete = useCallback(() => {
    removeTasks(ids);
    clearSelection();
  }, [ids, removeTasks, clearSelection]);

  const handleComplete = useCallback(() => {
    setTasksComplete(ids, true);
    clearSelection();
  }, [ids, setTasksComplete, clearSelection]);

  const handleIncomplete = useCallback(() => {
    setTasksComplete(ids, false);
    clearSelection();
  }, [ids, setTasksComplete, clearSelection]);

  const handleMoveTo = useCallback(
    (columnId: string) => {
      moveTasksToColumn(ids, columnId);
      clearSelection();
      setShowMoveMenu(false);
    },
    [ids, moveTasksToColumn, clearSelection],
  );

  const toggleMoveMenu = useCallback(() => {
    setShowMoveMenu((prev) => !prev);
  }, []);

  return {
    columns,
    selectedTaskIds,
    clearSelection,
    showMoveMenu,
    handleDelete,
    handleComplete,
    handleIncomplete,
    handleMoveTo,
    toggleMoveMenu,
  };
};
