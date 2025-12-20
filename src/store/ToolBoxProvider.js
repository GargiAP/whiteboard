import React, { useReducer } from "react";
import { TOOL_ITEMS, COLORS, TOOLBOX_ACTIONS } from "../constants/toolItems";
import toolboxContext from "./toolBoxContext";

function toolboxReducer(state, action) {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      const newState = { ...state };
      newState[action.payload.tool].stroke = action.payload.stroke;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {         //in blocks coz defining same variables 
      const newState = { ...state };
      newState[action.payload.tool].fill = action.payload.fill;
      return newState;
    }
     case TOOLBOX_ACTIONS.CHANGE_SIZE: {         //in blocks coz defining same variables 
      const newState = { ...state };
      newState[action.payload.tool].size = action.payload.size;
      return newState;
    }
    default:
      return state;
  }
}

const initialToolboxState = {
   [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
};

const ToolBoxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: { tool, stroke },
    });
  };

  const changeFillHandler = (tool, fill) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: { tool, fill },
    });
  };

    const changeSizeHandler = (tool, size) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: { tool, size},
    });
  };


  const toolboxContextValue = {
    toolboxState,
    changeStroke: changeStrokeHandler,
    changeFill: changeFillHandler,
    changeSize: changeSizeHandler
  };

  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};

export default ToolBoxProvider;
