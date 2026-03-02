import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardState {
  columns: Column[];
  tasks: Record<string, Task>;

  addTask: (columnId: string, text: string) => void;
  removeTask: (taskId: string) => void;
  removeTasks: (taskIds: string[]) => void;
  toggleTaskComplete: (taskId: string) => void;
  setTasksComplete: (taskIds: string[], completed: boolean) => void;
  editTaskText: (taskId: string, text: string) => void;
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number,
  ) => void;
  reorderTask: (taskId: string, columnId: string, toIndex: number) => void;

  addColumn: (title: string) => void;
  removeColumn: (columnId: string) => void;
  editColumnTitle: (columnId: string, title: string) => void;
  reorderColumn: (columnId: string, toIndex: number) => void;
  moveTasksToColumn: (taskIds: string[], targetColumnId: string) => void;
}

const DEFAULT_TASK_IDS = {
  backlog1: crypto.randomUUID(),
  backlog2: crypto.randomUUID(),
  backlog3: crypto.randomUUID(),
  progress1: crypto.randomUUID(),
  progress2: crypto.randomUUID(),
  review1: crypto.randomUUID(),
  review2: crypto.randomUUID(),
};

const DEFAULT_TASKS: Record<string, Task> = {
  [DEFAULT_TASK_IDS.backlog1]: {
    id: DEFAULT_TASK_IDS.backlog1,
    text: "Set up CI/CD pipeline with GitHub Actions",
    completed: false,
    createdAt: Date.now() - 7200000,
  },
  [DEFAULT_TASK_IDS.backlog2]: {
    id: DEFAULT_TASK_IDS.backlog2,
    text: "Migrate auth module to JWT refresh token rotation",
    completed: false,
    createdAt: Date.now() - 5400000,
  },
  [DEFAULT_TASK_IDS.backlog3]: {
    id: DEFAULT_TASK_IDS.backlog3,
    text: "Add E2E tests for the drag-and-drop interactions",
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  [DEFAULT_TASK_IDS.progress1]: {
    id: DEFAULT_TASK_IDS.progress1,
    text: "Implement task search with fuzzy matching",
    completed: false,
    createdAt: Date.now() - 9000000,
  },
  [DEFAULT_TASK_IDS.progress2]: {
    id: DEFAULT_TASK_IDS.progress2,
    text: "Refactor column store to use normalised entity shape",
    completed: false,
    createdAt: Date.now() - 10800000,
  },
  [DEFAULT_TASK_IDS.review1]: {
    id: DEFAULT_TASK_IDS.review1,
    text: "Code review: board reorder & multi-column drag",
    completed: false,
    createdAt: Date.now() - 1800000,
  },
  [DEFAULT_TASK_IDS.review2]: {
    id: DEFAULT_TASK_IDS.review2,
    text: "Update README with local setup and architecture notes",
    completed: true,
    createdAt: Date.now() - 14400000,
  },
};

const DEFAULT_COLUMNS: Column[] = [
  {
    id: crypto.randomUUID(),
    title: "Backlog",
    taskIds: [
      DEFAULT_TASK_IDS.backlog1,
      DEFAULT_TASK_IDS.backlog2,
      DEFAULT_TASK_IDS.backlog3,
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "In Progress",
    taskIds: [DEFAULT_TASK_IDS.progress1, DEFAULT_TASK_IDS.progress2],
  },
  {
    id: crypto.randomUUID(),
    title: "Review",
    taskIds: [DEFAULT_TASK_IDS.review1, DEFAULT_TASK_IDS.review2],
  },
];

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      columns: DEFAULT_COLUMNS,
      tasks: DEFAULT_TASKS,

      addTask: (columnId, text) => {
        const task: Task = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          tasks: { ...state.tasks, [task.id]: task },
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, taskIds: [...col.taskIds, task.id] }
              : col,
          ),
        }));
      },

      removeTask: (taskId) =>
        set((state) => {
          const { [taskId]: _, ...remainingTasks } = state.tasks;
          return {
            tasks: remainingTasks,
            columns: state.columns.map((col) => ({
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            })),
          };
        }),

      removeTasks: (taskIds) =>
        set((state) => {
          const idsSet = new Set(taskIds);
          const remainingTasks = { ...state.tasks };
          for (const id of taskIds) delete remainingTasks[id];
          return {
            tasks: remainingTasks,
            columns: state.columns.map((col) => ({
              ...col,
              taskIds: col.taskIds.filter((id) => !idsSet.has(id)),
            })),
          };
        }),

      toggleTaskComplete: (taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              completed: !state.tasks[taskId].completed,
            },
          },
        })),

      setTasksComplete: (taskIds, completed) =>
        set((state) => {
          const updated = { ...state.tasks };
          for (const id of taskIds) {
            if (updated[id]) updated[id] = { ...updated[id], completed };
          }
          return { tasks: updated };
        }),

      editTaskText: (taskId, text) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: { ...state.tasks[taskId], text },
          },
        })),

      moveTask: (taskId, fromColumnId, toColumnId, toIndex) =>
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                taskIds: col.taskIds.filter((id) => id !== taskId),
              };
            }
            if (col.id === toColumnId) {
              const newIds = col.taskIds.filter((id) => id !== taskId);
              newIds.splice(toIndex, 0, taskId);
              return { ...col, taskIds: newIds };
            }
            return col;
          }),
        })),

      reorderTask: (taskId, columnId, toIndex) =>
        set((state) => ({
          columns: state.columns.map((col) => {
            if (col.id !== columnId) return col;
            const ids = col.taskIds.filter((id) => id !== taskId);
            ids.splice(toIndex, 0, taskId);
            return { ...col, taskIds: ids };
          }),
        })),

      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { id: crypto.randomUUID(), title, taskIds: [] },
          ],
        })),

      removeColumn: (columnId) =>
        set((state) => {
          const col = state.columns.find((c) => c.id === columnId);
          const remainingTasks = { ...state.tasks };
          if (col) {
            for (const id of col.taskIds) delete remainingTasks[id];
          }
          return {
            tasks: remainingTasks,
            columns: state.columns.filter((c) => c.id !== columnId),
          };
        }),

      editColumnTitle: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId ? { ...col, title } : col,
          ),
        })),

      reorderColumn: (columnId, toIndex) =>
        set((state) => {
          const cols = [...state.columns];
          const fromIndex = cols.findIndex((c) => c.id === columnId);
          if (fromIndex === -1) return state;
          const [col] = cols.splice(fromIndex, 1);
          cols.splice(toIndex, 0, col);
          return { columns: cols };
        }),

      moveTasksToColumn: (taskIds, targetColumnId) =>
        set((state) => {
          const idsSet = new Set(taskIds);
          const targetCol = state.columns.find((c) => c.id === targetColumnId);
          const alreadyInTarget = targetCol
            ? new Set(targetCol.taskIds.filter((id) => idsSet.has(id)))
            : new Set<string>();
          const toMove = taskIds.filter((id) => !alreadyInTarget.has(id));

          return {
            columns: state.columns.map((col) => {
              if (col.id === targetColumnId) {
                return { ...col, taskIds: [...col.taskIds, ...toMove] };
              }
              const toMoveSet = new Set(toMove);
              return {
                ...col,
                taskIds: col.taskIds.filter((id) => !toMoveSet.has(id)),
              };
            }),
          };
        }),
    }),
    { name: "todo" },
  ),
);
