import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useBoardStore, useUIStore } from "../../store";
import { useDraggableCard, useDroppableCard } from "../../hooks";

export const useTaskItem = (taskId: string, columnId: string) => {
  const task = useBoardStore((s) => s.tasks[taskId]);
  const toggleComplete = useBoardStore((s) => s.toggleTaskComplete);
  const editText = useBoardStore((s) => s.editTaskText);
  const removeTask = useBoardStore((s) => s.removeTask);
  const columns = useBoardStore((s) => s.columns);
  const moveTask = useBoardStore((s) => s.moveTask);

  const searchQuery = useUIStore((s) => s.searchQuery);
  const selectedTaskIds = useUIStore((s) => s.selectedTaskIds);
  const toggleSelection = useUIStore((s) => s.toggleTaskSelection);
  const activeTaskId = useUIStore((s) => s.activeTaskId);
  const setActiveTask = useUIStore((s) => s.setActiveTask);
  const isInteracting = useUIStore((s) => s.isInteracting);
  const setIsInteracting = useUIStore((s) => s.setIsInteracting);
  const showColumnSelect = useUIStore((s) => s.showColumnSelect);

  const isSelected = selectedTaskIds.has(taskId);
  const isActive = activeTaskId === taskId;

  const [isEditingRaw, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showMoveMenuRaw, setShowMoveMenu] = useState(false);
  const [moveMenuPos, setMoveMenuPos] = useState({ top: 0, left: 0 });

  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const moveBtnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Derived state that only shows edit/move UI when task is active.
   * This automatically resets UI states when task becomes inactive, avoiding cascading renders.
   */
  const isEditing = isEditingRaw && isActive;
  const showMoveMenu = showMoveMenuRaw && isActive;
  const hasMultipleColumns = columns.length > 1;

  const { isDragging } = useDraggableCard(cardRef, taskId, columnId);
  const { closestEdge } = useDroppableCard(cardRef, taskId);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = useCallback(() => {
    if (task) setEditValue(task.text);
    setIsEditing(true);
    setActiveTask(taskId);
    setIsInteracting(true);
  }, [task, taskId, setActiveTask, setIsInteracting]);

  const handleSaveClick = useCallback(() => {
    const trimmed = editValue.trim();
    if (task && trimmed && trimmed !== task.text) {
      editText(taskId, trimmed);
    }
    setIsEditing(false);
    setIsInteracting(false);
    setActiveTask(null);
  }, [editValue, task, taskId, editText, setActiveTask, setIsInteracting]);

  const handleEditKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setIsInteracting(false);
        setActiveTask(null);
      }
    },
    [setActiveTask, setIsInteracting],
  );

  const handleMoveClick = useCallback(() => {
    if (!showMoveMenu && moveBtnRef.current) {
      const rect = moveBtnRef.current.getBoundingClientRect();
      setMoveMenuPos({ top: rect.bottom + 4, left: rect.right });
    }
    const opening = !showMoveMenu;
    setShowMoveMenu(opening);
    if (opening) {
      setActiveTask(taskId);
      setIsInteracting(true);
    } else {
      setIsInteracting(false);
      setActiveTask(null);
    }
  }, [showMoveMenu, taskId, setActiveTask, setIsInteracting]);

  const handleMoveToColumn = useCallback(
    (targetColumnId: string) => {
      if (targetColumnId !== columnId) {
        const targetCol = columns.find((c) => c.id === targetColumnId);
        moveTask(
          taskId,
          columnId,
          targetColumnId,
          targetCol?.taskIds.length ?? 0,
        );
      }
      setShowMoveMenu(false);
      setIsInteracting(false);
      setActiveTask(null);
    },
    [columns, columnId, taskId, moveTask, setActiveTask, setIsInteracting],
  );

  const handleCompleteClick = useCallback(() => {
    toggleComplete(taskId);
    setActiveTask(null);
    setIsInteracting(false);
  }, [taskId, toggleComplete, setActiveTask, setIsInteracting]);

  const handleDeleteClick = useCallback(() => {
    removeTask(taskId);
    setActiveTask(null);
    setIsInteracting(false);
  }, [taskId, removeTask, setActiveTask, setIsInteracting]);

  // Selected and active states are mutually exclusive - clear active when selecting
  const handleSelectClick = useCallback(() => {
    toggleSelection(taskId);
    setActiveTask(null);
    setIsInteracting(false);
  }, [taskId, toggleSelection, setActiveTask, setIsInteracting]);

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ignore clicks on interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Selected tasks can't be activated (prevents showing buttons while selected)
      if (isSelected) {
        return;
      }

      if (isInteracting) {
        setActiveTask(null);
        setIsInteracting(false);
      } else {
        setActiveTask(isActive ? null : taskId);
      }
    },
    [
      isInteracting,
      isActive,
      isSelected,
      taskId,
      setActiveTask,
      setIsInteracting,
    ],
  );

  return {
    task,
    searchQuery,
    isSelected,
    isActive,
    isEditing,
    editValue,
    setEditValue,
    showMoveMenu,
    moveMenuPos,
    isDragging,
    closestEdge,
    hasMultipleColumns,
    showColumnSelect,
    columns,
    cardRef,
    editInputRef,
    moveBtnRef,
    handleEditClick,
    handleSaveClick,
    handleEditKeyDown,
    handleMoveClick,
    handleMoveToColumn,
    handleCompleteClick,
    handleDeleteClick,
    handleSelectClick,
    handleCardClick,
  };
};
