// src/store/BoardProvider.js
import React, { useReducer } from "react";
import rough from "roughjs/bin/rough";
import boardContext from "./board.context";
import { createRoughElement } from "../utils/element";
import { BOARD_ACTIONS, TOOL_ACTIONS_TYPES, TOOL_ITEMS } from "../constants/toolItems";
const gen= rough.generator();
const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
        {
           return {
        ...state,
        activeToolItem: action.payload.tool,
      };
        }
     
      case BOARD_ACTIONS.DRAW_DOWN:
        {
            const {clientX,clientY} =action.payload;
            const newElement=createRoughElement(state.elements.length,clientX,clientY,clientX,clientY,
                {type:state.activeToolItem});
        
        const prevElements = state.elements;
        return {
            ...state,
            toolActionType:TOOL_ACTIONS_TYPES.DRAWING,
            elements:[...prevElements,newElement],
        };
        }
       
        case BOARD_ACTIONS.DRAW_MOVE:
            {
            const {clientX,clientY} =action.payload;
            const newElements=[...state.elements];
            const index=state.elements.length-1;
            const {x1,y1} =newElements[index];
            //newElements[index].x2=clientX;
            //newElements[index].y2=clientY;
            //newElements[index].roughEle=gen.line(
             //   newElements[index].x1,
             //   newElements[index].y1,
             //   clientX,
             //   clientY,
             const newElement = createRoughElement(index,x1,y1,clientX,clientY,{type:state.activeToolItem});
            newElements[index]=newElement;

            return{
                ...state,
                elements:newElements,
            }
            


            };
            
        case BOARD_ACTIONS.DRAW_UP:
            {
                return{
                    ...state,
                    toolActionType:TOOL_ACTIONS_TYPES.NONE,
                };
            }

        
    default:
      return state;
  }
};

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolActionType:TOOL_ACTIONS_TYPES.NONE,
  elements: [],
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: { tool } });
  };
  
  const boardMouseDownHandler= (event)=>{
    const {clientX,clientY} = event;
    const roughEle=gen.line(clientX,clientY,clientX,clientY);
    dispatchBoardAction({
        type:BOARD_ACTIONS.DRAW_DOWN,
        payload : {
            clientX,
            clientY,
        },
    });
  };

  const boardMouseMoveHandler= (event)=>{
    const {clientX,clientY} = event;
    const roughEle=gen.line(clientX,clientY,clientX,clientY);
    dispatchBoardAction({
        type:BOARD_ACTIONS.DRAW_MOVE,
        payload : {
            clientX,
            clientY,
        },
    });
  };

    const boardMouseUpHandler= ()=>{
    dispatchBoardAction({
        type:BOARD_ACTIONS.DRAW_UP,

    });
  };


  const boardContextValue = {
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    toolActionType:boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
