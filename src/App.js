
import './App.css';
import Board from './components/Board';
import Toolbar from './components/ToolBar';
import Toolbox from './components/ToolBox';
import BoardProvider from './store/BoardProvider';
import ToolBoxProvider from './store/ToolBoxProvider';
function App() {


  return (
    <BoardProvider>
    <ToolBoxProvider>
      <Toolbar />
      <Board />
      <Toolbox />
    </ToolBoxProvider>
    </BoardProvider>
  );
}

export default App;
