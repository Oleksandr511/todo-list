import { memo } from "react";
import clsx from "clsx";
import { useSelectionBar } from "./useBulkActions";
import styles from "./BulkActions.module.css";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger" | "cancel";
}

const ActionButton = memo(
  ({ label, onClick, variant = "default" }: ActionButtonProps) => (
    <button
      className={clsx(
        variant === "cancel" ? styles.cancelBtn : styles.btn,
        variant === "danger" && styles.dangerBtn,
      )}
      onClick={onClick}
    >
      {label}
    </button>
  ),
);

export const SelectionBar = memo(() => {
  const {
    columns,
    selectedTaskIds,
    clearSelection,
    showMoveMenu,
    handleDelete,
    handleComplete,
    handleIncomplete,
    handleMoveTo,
    toggleMoveMenu,
  } = useSelectionBar();

  if (selectedTaskIds.size === 0) return null;

  return (
    <div className={styles.bar}>
      <ActionButton label="cancel" onClick={clearSelection} variant="cancel" />
      <div className={styles.divider} />
      <span className={styles.count}>{selectedTaskIds.size} selected</span>
      <ActionButton label="done" onClick={handleComplete} />
      <ActionButton label="undo" onClick={handleIncomplete} />
      <div className={styles.moveWrapper}>
        <ActionButton label="move" onClick={toggleMoveMenu} />
        {showMoveMenu && (
          <div className={styles.moveMenu}>
            {columns.map((c) => (
              <button
                key={c.id}
                className={styles.moveMenuItem}
                onClick={() => handleMoveTo(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.divider} />
      <ActionButton label="del" onClick={handleDelete} variant="danger" />
    </div>
  );
});
