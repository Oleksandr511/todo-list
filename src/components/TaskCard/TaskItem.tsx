import { memo } from "react";
import clsx from "clsx";
import { EditTextarea } from "./EditTextarea";
import { HighlightedText } from "./HighlightedText";
import { DropIndicator } from "../DropIndicator";
import { Button } from "../ui";
import type { Column } from "../../store";
import { useTaskItem } from "./useTaskCard";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  taskId: string;
  columnId: string;
}

interface MoveMenuProps {
  moveBtnRef: React.RefObject<HTMLButtonElement | null>;
  columns: Column[];
  currentColumnId: string;
  showMenu: boolean;
  menuPos: { top: number; left: number };
  onToggle: () => void;
  onMove: (columnId: string) => void;
}

const MoveMenu = memo(
  ({
    moveBtnRef,
    columns,
    currentColumnId,
    showMenu,
    menuPos,
    onToggle,
    onMove,
  }: MoveMenuProps) => (
    <div className={styles.moveWrapper}>
      <Button
        ref={moveBtnRef}
        variant="move"
        onClick={onToggle}
        title="Move to lane"
      >
        move
      </Button>
      {showMenu && (
        <div
          className={styles.moveMenu}
          style={{
            top: menuPos.top,
            left: menuPos.left,
            transform: "translateX(-100%)",
          }}
        >
          {columns
            .filter((c) => c.id !== currentColumnId)
            .map((c) => (
              <button
                key={c.id}
                className={styles.moveMenuItem}
                onClick={() => onMove(c.id)}
              >
                {c.title}
              </button>
            ))}
        </div>
      )}
    </div>
  ),
);

export const TaskItem = memo(({ taskId, columnId }: TaskCardProps) => {
  const {
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
  } = useTaskItem(taskId, columnId);

  if (!task) return null;

  return (
    <div
      ref={cardRef}
      className={clsx(
        styles.card,
        isDragging && styles.dragging,
        isSelected && styles.selected,
        isActive && styles.active,
        task.completed && styles.completed,
      )}
      onClick={handleCardClick}
    >
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}

      <div className={styles.toolbar}>
        <Button
          variant="select"
          active={isSelected}
          onClick={handleSelectClick}
          title={isSelected ? "Deselect task" : "Select task"}
        >
          {isSelected ? "ok" : ""}
        </Button>

        <div className={styles.actions}>
          {isEditing ? (
            <Button variant="save" onClick={handleSaveClick} title="Save">
              save
            </Button>
          ) : (
            <Button variant="edit" onClick={handleEditClick} title="Edit task">
              edit
            </Button>
          )}
          <Button
            variant="complete"
            active={task.completed}
            onClick={handleCompleteClick}
            title={task.completed ? "Reopen task" : "Mark done"}
          >
            {task.completed ? "undo" : "done"}
          </Button>
          {hasMultipleColumns && (
            <MoveMenu
              moveBtnRef={moveBtnRef}
              columns={columns}
              currentColumnId={columnId}
              showMenu={showMoveMenu}
              menuPos={moveMenuPos}
              onToggle={handleMoveClick}
              onMove={handleMoveToColumn}
            />
          )}
          <Button
            variant="delete"
            onClick={handleDeleteClick}
            title="Delete task"
          >
            del
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {isEditing ? (
          <EditTextarea
            ref={editInputRef}
            value={editValue}
            onChange={setEditValue}
            onKeyDown={handleEditKeyDown}
          />
        ) : (
          <span className={styles.text}>
            <HighlightedText text={task.text} query={searchQuery} />
          </span>
        )}
      </div>
    </div>
  );
});
