// src/store/BoardProvider.js
import React, { useReducer, context } from "react";
import rough from "roughjs/bin/rough";
import boardContext from "./boardcontext";
import { createElement, getSvgPathFromStroke, isPointNearElement } from "../utils/element";
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
        const newElement = createElement(
          state.elements.length,
          clientX,
          clientY,
          clientX,
          clientY,
          { type: state.activeToolItem, stroke, fill, size }
        );

        return {
          ...state,
          toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTIONS_TYPES.WRITING : TOOL_ACTIONS_TYPES.DRAWING,
          elements: [...state.elements, newElement],
        };
      }
          case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
            return {
              ...state,
              toolActionType: action.payload.actionType,
            };
      }

    case BOARD_ACTIONS.DRAW_UP: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index+1);
      newHistory.push(elementsCopy);
      return {
        ...state,
        history: newHistory,
        index: state.index+1,
      }
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
                   const newElement = createElement(index,x1,y1,clientX,clientY,{type:state.activeToolItem, stroke, fill, size});
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
              case TOOL_ITEMS.TEXT: 
               {
              return {
                ...state,
                elements: newElements,
              };
            }


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
          const newHistory = state.history.slice(0, state.index+1);
          newHistory.push(newElements);
          return {
            ...state,
            elements: newElements,
            history: newHistory,
            index: state.index+1,

          };
        }

        case BOARD_ACTIONS.UPDATE_TEXT: {
          const { index, text } = action.payload;
          const newElements = [...state.elements];
          newElements[index] = { ...newElements[index], text };
          const newHistory = state.history.slice(0, state.index+1);
          newHistory.push(newElements);

          return {
            ...state,
            elements: newElements,
            toolActionType: TOOL_ACTIONS_TYPES.NONE, 
            history: newHistory,
            index: state.index+1
          };
        }

        case BOARD_ACTIONS.UNDO: {
          if(state.index <= 0) return state;
          return {
            ...state,
            elements: state.history[state.index-1],
            index: state.index-1,
          }
        }

         case BOARD_ACTIONS.REDO: {
          if(state.index >= state.history.length - 1) return state;
          return {
            ...state,
            elements: state.history[state.index+1],
            index: state.index+1,
          }
        }


          default:
            return state;
        }
      };

  const initialBoardState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    toolActionType:TOOL_ACTIONS_TYPES.NONE,
    elements: [],
    history: [[]],
    index: 0,

  };

const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({ type: BOARD_ACTIONS.CHANGE_TOOL, payload: { tool } });
  };
const boardMouseDownHandler = (event, toolboxState) => {
  const { clientX, clientY } = event;

  // Commit existing text if WRITING
  if (boardState.toolActionType === TOOL_ACTIONS_TYPES.WRITING) {
    const lastElement = boardState.elements[boardState.elements.length - 1];
    if (lastElement?.type === TOOL_ITEMS.TEXT) {
      updateTextHandler(lastElement.id, lastElement.text || "");
    }
  }

  if (boardState.activeToolItem === TOOL_ITEMS.TEXT) {
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[TOOL_ITEMS.TEXT]?.stroke,
        size: toolboxState[TOOL_ITEMS.TEXT]?.size,
      },
    });

    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTIONS_TYPES.WRITING,
      },
    });

    return;
  }

  if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: { actionType: TOOL_ACTIONS_TYPES.ERASING },
    });
    return;
  }

  dispatchBoardAction({
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
    if(boardState.toolActionType ===  TOOL_ACTIONS_TYPES.WRITING) return;
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
    if(boardState.toolActionType ===  TOOL_ACTIONS_TYPES.WRITING) return;
    if(boardState.toolActionType === TOOL_ACTIONS_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      })
    }
     dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTIONS_TYPES.NONE,
      }
    });
  };

const updateTextHandler = (id, text) => {
  dispatchBoardAction({
    type: BOARD_ACTIONS.UPDATE_TEXT,
    payload: { index: id, text },
  });
};

const boardUndoHandler = () => {
  dispatchBoardAction({
    type: BOARD_ACTIONS.UNDO,
  })

}

const boardRedoHandler = () => {
  dispatchBoardAction({
    type: BOARD_ACTIONS.REDO,
  })

}

const boardContextValue = {
  activeToolItem: boardState.activeToolItem,
  elements: boardState.elements,
  toolActionType: boardState.toolActionType,
  changeToolHandler,
  boardMouseDownHandler,
  boardMouseMoveHandler,
  boardMouseUpHandler,
  updateTextHandler, 
  undo: boardUndoHandler,
  redo: boardRedoHandler
};


  
  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
