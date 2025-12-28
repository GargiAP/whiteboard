import React, { useContext, useEffect, useRef,useLayoutEffect } from 'react';
import rough from "roughjs";
import boardContext from '../../store/boardcontext';
import { TOOL_ACTIONS_TYPES, TOOL_ITEMS} from '../../constants/toolItems';
import toolboxContext from '../../store/toolBoxContext';
import classes from './index.module.css';
function Board() {
  const canvasRef = useRef();
const {
  elements,
  boardMouseDownHandler,
  boardMouseMoveHandler,
  toolActionType,
  boardMouseUpHandler,
  updateTextHandler
} = useContext(boardContext);
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
        case TOOL_ITEMS.TEXT:
          context.fillStyle = elements.stroke;
          context.font = `${elements.size}px Caveat`;
          context.fillText(elements.text, elements.x1, elements.y1);
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
  const lastElement = elements[elements.length - 1];

  const handleTextBlur = (e) => {
  if (!lastElement) return;

  updateTextHandler(lastElement.id, e.target.value);
  boardMouseUpHandler(); // ends WRITING mode
};
const canvas = canvasRef.current;

return (
  <>
    {toolActionType === TOOL_ACTIONS_TYPES.WRITING && 
 (
<textarea
  className={classes.textElementBox}
  style={{
    top: `${lastElement.y1}px`,
    left: `${lastElement.x1}px`,
    fontSize: `${lastElement.size}px`,
    color: "#000", 

  }}
  onBlur={handleTextBlur}

/>
    )}

    <canvas
      ref={canvasRef}
      id="canvas"
      onMouseDown={handleBoardMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  </>
);
};

export default Board;
