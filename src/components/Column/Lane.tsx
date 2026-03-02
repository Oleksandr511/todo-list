import { memo } from "react";
import clsx from "clsx";
import { useLane } from "./useColumn";
import { LaneHeader } from "./LaneHeader";
import { TaskItem } from "../TaskCard";
import { TaskInput } from "./TaskInput";
import { DropIndicator } from "../DropIndicator";
import styles from "./Column.module.css";

interface LaneProps {
  columnId: string;
}

export const Lane = memo(({ columnId }: LaneProps) => {
  const {
    column,
    columnRef,
    handleRef,
    isDragging,
    closestEdge,
    filteredTaskIds,
    searchQuery,
    filterStatus,
  } = useLane({ columnId });

  if (!column) return null;

  return (
    <div
      ref={columnRef}
      className={clsx(styles.column, isDragging && styles.dragging)}
    >
      {closestEdge && <DropIndicator edge={closestEdge} gap="12px" />}
      <LaneHeader
        columnId={column.id}
        title={column.title}
        taskIds={filteredTaskIds}
        dragHandleRef={handleRef}
      />
      <div className={styles.taskList}>
        {filteredTaskIds.length === 0 && (
          <p className={styles.empty}>
            {searchQuery || filterStatus !== "all"
              ? "No results"
              : "No tasks yet"}
          </p>
        )}
        {filteredTaskIds.map((taskId) => (
          <TaskItem key={taskId} taskId={taskId} columnId={column.id} />
        ))}
      </div>
      <TaskInput columnId={column.id} />
    </div>
  );
});
