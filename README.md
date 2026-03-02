# todo

Todo board for managing tasks. Built with React + TypeScript + Vite.



## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

```bash
npm run build    # production build
npm run preview  # preview the build
```

## Features

- Add / rename / delete columns
- Add / edit / delete tasks
- Mark tasks as done or reopen them
- Drag and drop to reorder tasks and columns
- Move tasks between columns
- Select multiple tasks — bulk mark as done, undo, move, or delete
- Select all tasks in a column
- Search tasks (fuzzy match, tolerates typos)
- Filter by status: all / active / done
- State persisted in localStorage

## Stack

- **React 19** + **TypeScript**
- **Zustand** — two stores: `boardStore` (data) and `uiStore` (search, filters, selections)
- **@atlaskit/pragmatic-drag-and-drop** — drag and drop
- **CSS Modules** — scoped styles, no CSS-in-JS
- Custom fuzzy search with highlighted matches
- Responsive — works on mobile (swipeable column carousel)

## Project structure

```
src/
├── components/
│   ├── ToolBar/        — search, filter, add column
│   ├── Workspace/      — board container
│   ├── Column/         — lane + header + task input
│   ├── TaskCard/       — task card + edit
│   ├── BulkActions/    — multi-select action bar
│   ├── DropIndicator/  — drag-and-drop visual cue
│   └── ui/             — Button
├── hooks/              — drag-and-drop hooks
├── store/              — boardStore, uiStore
├── utils/              — debounce, fuzzyMatch
└── styles/             — variables, globals
```
