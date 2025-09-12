
import './App.css';
import Board from './components/Board';
import Toolbox from './components/ToolBar';
import BoardProvider from './store/BoardProvider';
import ToolBoxProvider from './store/ToolBoxProvider';
function App() {


  return (
    <BoardProvider>
    <ToolBoxProvider>
      <Toolbox />
      <Board />
    </ToolBoxProvider>
    </BoardProvider>
  );
}

export default App;
