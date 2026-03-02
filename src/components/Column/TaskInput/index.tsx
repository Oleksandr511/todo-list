import { memo } from 'react';
import { useTaskInput } from './useTaskInput';
import styles from './TaskInput.module.css';

interface TaskInputProps {
  columnId: string;
}

export const TaskInput = memo(({ columnId }: TaskInputProps) => {
  const { text, setText, handleSubmit, handleFocus } = useTaskInput({ columnId });

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.textarea}
        placeholder="create new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
      />
      {text.trim() && (
        <button
          className={styles.confirmBtn}
          onClick={handleSubmit}
          title="Add task"
        >
          ok
        </button>
      )}
    </div>
  );
});
