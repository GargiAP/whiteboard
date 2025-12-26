# Interactive Whiteboard Application

A **fully custom, browser-based whiteboard** built with React.  
Supports **freehand drawing, shapes, arrows, text, and erasing** with a **modular toolbox and toolbar**, powered by **custom mouse event handling** for smooth, real-time interactions.

## Project Overview

This project demonstrates advanced **frontend engineering skills**:

- **Canvas rendering** with Rough.js  
- **Custom mouse event handling** for drawing, moving, and erasing elements  
- **Modular toolbox and toolbar** for selecting tools and editing properties  
- Fully **client-side state management** using React Hooks + `useReducer`  
- **Extensible architecture** for future features like collaborative drawing  

## Features

### Drawing Tools
- Freehand brush with smooth strokes  
- Shapes: **Line, Rectangle, Circle, Arrow**  
- Text tool for annotations  
- **Selectable and erasable elements**

### Interaction
- **Custom mouse handlers**:
  - `mousedown` → start drawing, writing, or erasing  
  - `mousemove` → update element geometry or brush path  
  - `mouseup` → finalize element and reset state  
- Real-time, high-performance rendering  

### UI Components
- **Toolbox:** dynamic tool selection  
- **Toolbar:** edit color, stroke width, size, and other properties  
- **Modular & reusable design**: easy to add new tools
  
## Tech Stack
- **Frontend:** React.js  
- **Canvas Rendering:**Rough.js  
- **Brush Rendering:** perfect-freehand  
- **State Management:** React Hooks + `useReducer`  
- **Styling:** CSS Modules
- 
## How to Run Locally

### Prerequisites
- Node.js (v16+)  
- Git  

### Steps

git clone https://github.com/GargiAP/whiteboard.git
cd whiteboard
npm install
npm start

