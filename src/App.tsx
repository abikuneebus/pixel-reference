import { useState } from "react";
import Box from "./components/Box";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import { IShape } from "./types";

// App typed as functional component
const App: React.FC = () => {
  // state to hold array of shapes
  const [shapes, setShapes] = useState<IShape[]>([]);

  // handler for 'Generate' button click
  const handleGenerate = (width: number, height: number) => {
    // create new shape object
    const newShape: IShape = {
      id: `shape-${shapes.length + 1}`, // (simple) unique ID generator
      x: 50, // initial X pos
      y: 50, // initial Y pos
      width: width,
      height: height,
      type: "rectangle", // default shape
    };

    // update shapes array with new shape
    setShapes([...shapes, newShape]);
  };

  return (
    <div>
      <ControlPanel onGenerate={handleGenerate} />
      <Canvas>
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
          />
        ))}
      </Canvas>
    </div>
  );
};

export default App;
