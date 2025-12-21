// src/store/BoardProvider.js
import React, { useReducer } from "react";
import rough from "roughjs/bin/rough";
import boardContext from "./boardcontext";
import { createRoughElement, getSvgPathFromStroke, isPointNearElement } from "../utils/element";
import { BOARD_ACTIONS, TOOL_ACTIONS_TYPES, TOOL_ITEMS } from "../constants/toolItems";
import getStroke from "perfect-freehand";
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
     
      case BOARD_ACTIONS.DRAW_DOWN: {
        if (state.activeToolItem === TOOL_ITEMS.ERASER) {
          return {
            ...state,
            toolActionType: TOOL_ACTIONS_TYPES.ERASING,
          };
        }

        const { clientX, clientY, stroke, fill, size } = action.payload;

        const newElement = createRoughElement(
          state.elements.length,
          clientX,
          clientY,
          clientX,
          clientY,
          { type: state.activeToolItem, stroke, fill, size }
        );

        return {
          ...state,
          toolActionType: TOOL_ACTIONS_TYPES.DRAWING,
          elements: [...state.elements, newElement],
        };
      }
          case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
            return {
              ...state,
              toolActionType: action.payload.actionType,
            };
      }
    case BOARD_ACTIONS.DRAW_MOVE:
          {
            const {clientX,clientY} =action.payload;
            const newElements=[...state.elements];
            const index=state.elements.length-1;
            const {x1,y1,stroke,fill, size, type} =newElements[index];
            switch(type) {
              case TOOL_ITEMS.LINE:
              case TOOL_ITEMS.RECTANGLE: 
              case TOOL_ITEMS.CIRCLE:
              case TOOL_ITEMS.ARROW:
                   const newElement = createRoughElement(index,x1,y1,clientX,clientY,{type:state.activeToolItem, stroke, fill, size});
                   newElements[index]=newElement;

                    return{
                        ...state,
                        elements:newElements,
                    }
              case TOOL_ITEMS.BRUSH: 
                    newElements[index].points = [...newElements[index].points, {x: clientX, y:clientY}];
                    newElements[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points)));
                    return {
                      ...state,
                      elements: newElements,
                    };
              default:
                    throw new Error("Type not recognised");
            
            }
            
            }
            //newElements[index].x2=clientX;
            //newElements[index].y2=clientY;
            //newElements[index].roughEle=gen.line(
             //   newElements[index].x1,
             //   newElements[index].y1,
             //   clientX,
             //   clientY,
         
  
          case BOARD_ACTIONS.ERASE: {
          const {clientX, clientY} = action.payload;
          let newElements = [...state.elements];
          newElements = newElements.filter((element) => {
              return !isPointNearElement(element, clientX, clientY);
          });
          return {
            ...state,
            elements: newElements,
          };
        }
        default:
          return state;
      }
    };

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH,
  toolActionType:TOOL_ACTIONS_TYPES.NONE,
  elements: [],
};

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: { tool } });
  };
  
const boardMouseDownHandler = (event, toolboxState) => {
  const { clientX, clientY } = event;

    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTIONS_TYPES.ERASING,
        },
      });
      return;
    }dispatchBoardAction({
  type: BOARD_ACTIONS.DRAW_DOWN,
  payload: {
    clientX,
    clientY,
    stroke: toolboxState[boardState.activeToolItem]?.stroke,
    fill: toolboxState[boardState.activeToolItem]?.fill,
    size: toolboxState[boardState.activeToolItem]?.size,
  },
});

  };
  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTIONS_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTIONS_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

    const boardMouseUpHandler= ()=>{
     dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTIONS_TYPES.NONE,
      }
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
