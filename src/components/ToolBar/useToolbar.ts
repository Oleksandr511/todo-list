import { useMemo, useRef, useState, useCallback } from "react";
import { useBoardStore, useUIStore } from "../../store";
import type { FilterStatus } from "../../store";
import { debounce } from "../../utils";

export const useToolbar = () => {
  const addColumn = useBoardStore((s) => s.addColumn);
  const columns = useBoardStore((s) => s.columns);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const filterStatus = useUIStore((s) => s.filterStatus);
  const setFilterStatus = useUIStore((s) => s.setFilterStatus);
  const showColumnSelect = useUIStore((s) => s.showColumnSelect);
  const selectAllTasks = useUIStore((s) => s.selectAllTasks);
  const selectedTaskIds = useUIStore((s) => s.selectedTaskIds);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const debouncedSetSearch = useMemo(
    () => debounce((text: unknown) => setSearchQuery(text as string), 300),
    [setSearchQuery],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch],
  );

  const handleFilterChange = useCallback(
    (v: FilterStatus) => setFilterStatus(v),
    [setFilterStatus],
  );

  const handleAddColumn = useCallback(
    () => addColumn("New Column"),
    [addColumn],
  );

  const allTaskIds = useMemo(
    () => columns.flatMap((c) => c.taskIds),
    [columns],
  );
  const allSelected =
    allTaskIds.length > 0 && allTaskIds.every((id) => selectedTaskIds.has(id));

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      useUIStore.getState().clearSelection();
    } else {
      selectAllTasks(allTaskIds);
    }
  }, [allTaskIds, selectAllTasks, allSelected]);

  return {
    searchInputRef,
    localSearch,
    filterStatus,
    showColumnSelect,
    allSelected,
    handleSearchChange,
    handleFilterChange,
    handleAddColumn,
    handleSelectAll,
  };
};
