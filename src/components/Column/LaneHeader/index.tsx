import { memo } from "react";
import { Button } from "../../ui";
import { useLaneHeader } from "./useColumnHeader";
import styles from "./LaneHeader.module.css";

interface LaneHeaderProps {
  columnId: string;
  title: string;
  taskIds: string[];
  dragHandleRef: React.RefObject<HTMLDivElement | null>;
}

export const LaneHeader = memo(
  ({ columnId, title, taskIds, dragHandleRef }: LaneHeaderProps) => {
    const {
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
    } = useLaneHeader({ columnId, title, taskIds });

    return (
      <div className={styles.header} ref={dragHandleRef}>
        <div className={styles.left}>
          {showColumnSelect && taskIds.length > 0 && (
            <Button
              variant="select"
              size="md"
              active={allSelected}
              muted={!allSelected && !someSelected}
              onClick={handleSelectAll}
              title="Select all tasks in lane"
            >
              {allSelected ? "ok" : someSelected ? "–" : ""}
            </Button>
          )}
          {isEditing ? (
            <input
              ref={inputRef}
              className={styles.titleInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <h3 className={styles.title}>{title}</h3>
          )}
          <span className={styles.count}>{taskIds.length}</span>
        </div>
        {showColumnSelect && (
          <div className={styles.headerActions}>
            {isEditing ? (
              <Button
                variant="save"
                size="md"
                onClick={saveEdit}
                title="Save title"
              >
                ok
              </Button>
            ) : (
              <Button
                variant="edit"
                size="md"
                muted
                onClick={startEdit}
                title="Rename column"
              >
                rename
              </Button>
            )}
            {hasMultipleColumns && (
              <div className={styles.moveWrapper}>
                <Button
                  ref={moveBtnRef}
                  variant="move"
                  size="md"
                  muted
                  onClick={handleMoveClick}
                  title="Move lane"
                >
                  move
                </Button>
                {showMoveMenu && (
                  <div
                    ref={moveMenuRef}
                    className={styles.moveMenu}
                    style={{
                      top: moveMenuPos.top,
                      left: moveMenuPos.left,
                      transform: "translateX(-100%)",
                    }}
                  >
                    {columns.map((col, index) => {
                      if (col.id === columnId) return null;
                      const isBefore = index < currentIndex;
                      return (
                        <button
                          key={col.id}
                          className={styles.moveMenuItem}
                          onClick={() => handleMoveToPosition(index)}
                        >
                          {isBefore ? "Before -" : "After -"} {col.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <Button
              variant="delete"
              size="md"
              muted
              onClick={handleDelete}
              title="Delete lane"
            >
              del
            </Button>
          </div>
        )}
      </div>
    );
  },
);
