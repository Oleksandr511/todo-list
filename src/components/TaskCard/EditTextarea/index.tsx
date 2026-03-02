import { memo, forwardRef } from 'react';
import styles from '../TaskCard.module.css';

interface EditTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export const EditTextarea = memo(
  forwardRef<HTMLTextAreaElement, EditTextareaProps>(
    ({ value, onChange, onKeyDown, rows = 2 }, ref) => {
    return (
      <textarea
        ref={ref}
        className={styles.editInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
      />
    );
  }),
);
