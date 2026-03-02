import { memo } from "react";
import styles from "./ToolBar.module.css";

interface SearchProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  localSearch: string;
  onSearchChange: (value: string) => void;
}

export const Search = memo(
  ({ searchInputRef, localSearch, onSearchChange }: SearchProps) => (
    <div className={styles.searchWrap}>
      <input
        ref={searchInputRef}
        className={styles.searchInput}
        type="text"
        placeholder="search"
        value={localSearch}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  ),
);
