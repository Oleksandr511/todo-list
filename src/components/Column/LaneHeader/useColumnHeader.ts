import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useBoardStore, useUIStore } from "../../../store";

interface UseColumnHeaderProps {
  columnId: string;
  title: string;
  taskIds: string[];
}

export const useLaneHeader = ({
  columnId,
  title,
  taskIds,
}: UseColumnHeaderProps) => {
  const editTitle = useBoardStore((s) => s.editColumnTitle);
  const removeColumn = useBoardStore((s) => s.removeColumn);
  const reorderColumn = useBoardStore((s) => s.reorderColumn);
  const columns = useBoardStore((s) => s.columns);
  const selectedTaskIds = useUIStore((s) => s.selectedTaskIds);
  const selectAll = useUIStore((s) => s.selectAllInColumn);
  const deselectAll = useUIStore((s) => s.deselectAllInColumn);
  const showColumnSelect = useUIStore((s) => s.showColumnSelect);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [moveMenuPos, setMoveMenuPos] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const moveBtnRef = useRef<HTMLButtonElement>(null);
  const moveMenuRef = useRef<HTMLDivElement>(null);

  const allSelected =
    taskIds.length > 0 && taskIds.every((id) => selectedTaskIds.has(id));
  const someSelected = taskIds.some((id) => selectedTaskIds.has(id));

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close edit/move states when clicking outside - improves UX by auto-dismissing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isEditing && inputRef.current && !inputRef.current.contains(target)) {
        setIsEditing(false);
      }

      if (
        showMoveMenu &&
        moveMenuRef.current &&
        !moveMenuRef.current.contains(target) &&
        moveBtnRef.current &&
        !moveBtnRef.current.contains(target)
      ) {
        setShowMoveMenu(false);
      }
    };

    if (isEditing || showMoveMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isEditing, showMoveMenu]);

  const startEdit = useCallback(() => {
    setEditValue(title);
    setIsEditing(true);
  }, [title]);

  const saveEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      editTitle(columnId, trimmed);
    }
    setIsEditing(false);
  }, [editValue, title, columnId, editTitle]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") setIsEditing(false);
    },
    [saveEdit],
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) deselectAll(taskIds);
    else selectAll(taskIds);
  }, [allSelected, taskIds, selectAll, deselectAll]);

  const handleDelete = useCallback(() => {
    removeColumn(columnId);
  }, [columnId, removeColumn]);

  const handleMoveClick = useCallback(() => {
    if (!showMoveMenu && moveBtnRef.current) {
      const rect = moveBtnRef.current.getBoundingClientRect();
      setMoveMenuPos({ top: rect.bottom + 4, left: rect.right });
    }
    setShowMoveMenu(!showMoveMenu);
  }, [showMoveMenu]);

  const handleMoveToPosition = useCallback(
    (targetIndex: number) => {
      reorderColumn(columnId, targetIndex);
      setShowMoveMenu(false);
    },
    [columnId, reorderColumn],
  );

  const currentIndex = columns.findIndex((c) => c.id === columnId);
  const hasMultipleColumns = columns.length > 1;

  return {
    isEditing,
    editValue,
    setEditValue,
    inputRef,
    moveBtnRef,
    moveMenuRef,
    allSelected,
    someSelected,
    showColumnSelect,
    showMoveMenu,
    moveMenuPos,
    columns,
    currentIndex,
    hasMultipleColumns,
    startEdit,
    saveEdit,
    handleKeyDown,
    handleSelectAll,
    handleDelete,
    handleMoveClick,
    handleMoveToPosition,
  };
};
