import {createContext} from "react";

const boardContext=createContext({
    activeToolItem:"",
    toolActionType: "",
    elements: [], //jab jab elements change honge tab canvas redraw hoga
    history: [[]],
    index: 0,
    boardMouseDownHandler: () => {},
    changeToolHandler: ()=> {},
    boardMouseMoveHandler: () => {},
    boardMouseUpHandler: () => {},
});

export default boardContext;