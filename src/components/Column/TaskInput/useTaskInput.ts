import { useState, useCallback } from 'react';
import { useBoardStore, useUIStore } from '../../../store';

interface UseTaskInputProps {
  columnId: string;
}

export const useTaskInput = ({ columnId }: UseTaskInputProps) => {
  const [text, setText] = useState('');
  const addTask = useBoardStore((s) => s.addTask);
  const setActiveTask = useUIStore((s) => s.setActiveTask);
  const setIsInteracting = useUIStore((s) => s.setIsInteracting);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTask(columnId, trimmed);
    setText('');
  }, [text, columnId, addTask]);

  const handleFocus = useCallback(() => {
    setActiveTask(null);
    setIsInteracting(false);
  }, [setActiveTask, setIsInteracting]);

  return {
    text,
    setText,
    handleSubmit,
    handleFocus,
  };
}
