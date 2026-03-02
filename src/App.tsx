import { Toolbar } from "./components/ToolBar";
import { SelectionBar } from "./components/BulkActions";
import { Workspace } from "./components/Workspace";
import "./AppStyles.css";

export const App = () => {
  return (
    <div className="application">
      <Toolbar />
      <Workspace />
      <SelectionBar />
    </div>
  );
};
