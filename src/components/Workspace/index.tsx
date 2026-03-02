import { Lane } from "../Column";
import { useWorkspace } from "./useWorkspace";
import styles from "./Workspace.module.css";

export const Workspace = () => {
  const { columns } = useWorkspace();

  return (
    <div className={styles.board}>
      {columns.map((col) => (
        <Lane key={col.id} columnId={col.id} />
      ))}
      {columns.length === 0 && (
        <p className={styles.empty}>No lanes yet. Add one to get started</p>
      )}
    </div>
  );
};
