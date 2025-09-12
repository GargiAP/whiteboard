import React, { useContext, useEffect, useRef,useLayoutEffect } from 'react';
import rough from "roughjs";
import boardContext from '../../store/board.context';
import { TOOL_ACTIONS_TYPES } from '../../constants/toolItems';

function Board() {
  const canvasRef = useRef();
  const {elements,boardMouseDownHandler,boardMouseMoveHandler,toolActionType,boardMouseUpHandler}=useContext(boardContext);
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
      roughCanvas.draw(elements.roughEle);
    });
    return ()=> {
      context.clearRect(0,0,canvas.width,canvas.height);
    };
  }, [elements]);

  
  const handleBoardMouseDown=(event)=>{
    boardMouseDownHandler(event);
  };

    const handleMouseMove=(event)=>{
      if(toolActionType===TOOL_ACTIONS_TYPES.DRAWING)
      {
            boardMouseMoveHandler(event);

      }
  };

  const handleMouseUp=()=>{
   boardMouseUpHandler();
  };

  return <canvas ref={canvasRef} onMouseDown={handleBoardMouseDown} onMouseMove={handleMouseMove} 
  onMouseUp={handleMouseUp} />;
   
  
}

export default Board;
