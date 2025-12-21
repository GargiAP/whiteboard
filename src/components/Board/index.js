import React, { useContext, useEffect, useRef,useLayoutEffect } from 'react';
import rough from "roughjs";
import boardContext from '../../store/boardcontext';
import { TOOL_ACTIONS_TYPES, TOOL_ITEMS} from '../../constants/toolItems';
import toolboxContext from '../../store/toolBoxContext';

function Board() {
  const canvasRef = useRef();
  const {elements,boardMouseDownHandler,boardMouseMoveHandler,toolActionType,boardMouseUpHandler}=useContext(boardContext);
  const {toolboxState} = useContext(toolboxContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    
  }, []);

  useLayoutEffect(() => {  //new effect by react
    const canvas = canvasRef.current;
    const context=canvas.getContext("2d");
    const roughCanvas=rough.canvas(canvas);
   
    elements.forEach(elements=>{
      switch(elements.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE: 
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(elements.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle=elements.stroke;
          context.fill(elements.path);
          context.restore();
          break;
        default:
          throw new Error("type not recognised");

      }
    });
    return ()=> {
      context.clearRect(0,0,canvas.width,canvas.height);
    };
  }, [elements]);

  
  const handleBoardMouseDown=(event)=>{
    boardMouseDownHandler(event, toolboxState);
  };

    const handleMouseMove=(event)=>{
      boardMouseMoveHandler(event);
  };

  const handleMouseUp=()=>{
   boardMouseUpHandler();
  };

  return <canvas ref={canvasRef} id="canvas" onMouseDown={handleBoardMouseDown} onMouseMove={handleMouseMove} 
  onMouseUp={handleMouseUp} />;
   
  
}

export default Board;
