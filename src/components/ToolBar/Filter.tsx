import { memo } from "react";
import clsx from "clsx";
import type { FilterStatus } from "../../store";
import styles from "./ToolBar.module.css";

interface FilterProps {
  filterStatus: FilterStatus;
  onFilterChange: (value: FilterStatus) => void;
}

const OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "all" },
  { value: "incomplete", label: "active" },
  { value: "completed", label: "done" },
];

export const Filter = memo(({ filterStatus, onFilterChange }: FilterProps) => (
  <div className={styles.filterPills}>
    {OPTIONS.map(({ value, label }) => (
      <button
        key={value}
        className={clsx(
          styles.pill,
          filterStatus === value && styles.pillActive,
        )}
        onClick={() => onFilterChange(value)}
      >
        {label}
      </button>
    ))}
  </div>
));
