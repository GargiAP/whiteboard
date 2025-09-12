import {createContext} from "react";

const boardContext=createContext({
    activeToolItem:"",
    toolActionType: "",
    elements: [], //jab jab elements change honge tab canvas redraw hoga
    boardMouseDownHandler: () => {},
    changeToolHandler: ()=> {},
    boardMouseMoveHandler: () => {},
    boardMouseUpHandler: () => {},
});

export default boardContext;