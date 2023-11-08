import { useState } from "react";
import Box from "./components/Box";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import { IShape } from "./types";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// App typed as functional component
const App: React.FC = () => {
  // state to hold array of shapes
  const [shapes, setShapes] = useState<IShape[]>([]);

  // handler for 'Generate' button click
  const handleGenerate = (width: number, height: number, shape: 'rectangle' | 'circle' | 'triangle') => {
    // create new shape object
    const newShape: IShape = {
      id: `shape-${shapes.length + 1}`, // (simple) unique ID generator
      x: 50, // initial X pos
      y: 50, // initial Y pos
      width: width,
      height: height,
      type: shape, // default shape
    };
      // update shapes array with new shape
    setShapes([...shapes, newShape]);
  };

  // update position of the shapes
  const moveShape = (id: string, x: number, y: number) => {
    setShapes(shapes.map(shape => shape.id === id ? { ...shape, x, y } : shape));
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
    <div>
      <ControlPanel onGenerate={(width, height, shape) => handleGenerate(width, height, shape)} />
      <Canvas onDrop={moveShape}>
        {shapes.map((shape) => (
          // render a box for each shape in the state
          <Box
            key={shape.id}
            id={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            type={shape.type}
            onMove={moveShape} // pass the moveShape function to Box
          />
        ))}
      </Canvas>
    </div>
    </DndProvider>
  );
};

export default App;