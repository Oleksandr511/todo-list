import { memo } from "react";
import clsx from "clsx";
import { useToolbar } from "./useToolbar";
import { Search } from "./Search";
import { Filter } from "./Filter";
import styles from "./ToolBar.module.css";

export const Toolbar = memo(() => {
  const {
    searchInputRef,
    localSearch,
    filterStatus,
    allSelected,
    handleSearchChange,
    handleFilterChange,
    handleAddColumn,
    handleSelectAll,
  } = useToolbar();

  return (
    <div className={styles.bar}>
      <div className={styles.topRow}>
        <span className={styles.brand}>todo</span>
        <button className={styles.addBtn} onClick={handleAddColumn}>
          add column
        </button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.selectGroup}>
          <button
            className={clsx(
              styles.textBtn,
              allSelected && styles.textBtnActive,
            )}
            onClick={handleSelectAll}
          >
            select all
          </button>
        </div>

        <Search
          searchInputRef={searchInputRef}
          localSearch={localSearch}
          onSearchChange={handleSearchChange}
        />

        <Filter
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
});
