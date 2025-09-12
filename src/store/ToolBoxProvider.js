import React, { useReducer } from 'react';
import { TOOL_ITEMS,COLORS } from '../constants/toolItems'
import toolboxContext from './toolBoxContext';
function toolboxReducer (state, action){
    // switch (action.type) {
    //     case value:
    //         break;
    //     default:
    //         break;
    // }
}

const initialToolboxState ={
     [TOOL_ITEMS.LINE] : {
        stroke: COLORS.BLACK,
        size: 1,
     },
      [TOOL_ITEMS.RECTANGLE] : {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
     },
     [TOOL_ITEMS.CIRCLE] : {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
     },
     [TOOL_ITEMS.ARROW] : {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
     }
     //we can add more tools if we want to here 
}
const ToolBoxProvider = ({children}) => {
  const [toolboxState, dispatchToolboxAction]  = useReducer(toolboxReducer, initialToolboxState)
  const toolboxContextValue = {
     toolboxState,
  };
  return (
<toolboxContext.Provider value={toolboxContextValue}> 
    {children}
   </toolboxContext.Provider>
  )
}

export default ToolBoxProvider
