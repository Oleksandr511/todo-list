import { memo, forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export type ButtonVariant = 'select' | 'edit' | 'save' | 'complete' | 'move' | 'delete';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  onClick: () => void;
  title: string;
  active?: boolean;
  muted?: boolean;
  children?: React.ReactNode;
}

const activeClass: Partial<Record<ButtonVariant, string>> = {
  select: styles.selectActive,
  complete: styles.completeActive,
};

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size = 'sm', onClick, title, active, muted, children }, ref) => (
      <button
        ref={ref}
        className={clsx(
          styles.btn,
          styles[size],
          styles[variant],
          active && activeClass[variant],
          muted && styles.muted,
        )}
        onClick={onClick}
        title={title}
      >
        {children}
      </button>
    ),
  ),
);
