import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.scss";
import Box from "./components/Box";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import { IShape } from "./types";

const App: React.FC = () => {
  const [shapes, setShapes] = useState<IShape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [rotationVersion, setRotationVersion] = useState<number>(0);
  const resizeShape = (id: string, newWidth: number, newHeight: number) => {
    setShapes(
      shapes.map((shape) =>
        shape.id === id
          ? { ...shape, width: newWidth, height: newHeight }
          : shape
      )
    );
  };

  const handleGenerate = (
    width: number,
    height: number,
    shape: "rectangle" | "circle" | "triangle"
  ) => {
    const newShape: IShape = {
      id: `shape-${shapes.length + 1}`,
      x: 50,
      y: 50,
      width: width,
      height: height,
      type: shape,
      rotation: 0,
    };
    setShapes([...shapes, newShape]);
  };

  const selectShape = (id: string) => {
    setSelectedShape(id);
  };

  const rotateShape = (angleDelta: number) => {
    if (selectedShape) {
      setShapes((currentShapes) =>
        currentShapes.map((shape) =>
          shape.id === selectedShape
            ? { ...shape, rotation: (shape.rotation || 0) + angleDelta }
            : shape
        )
      );
      setRotationVersion(rotationVersion + 1);
    }
  };

  const moveShape = (id: string, x: number, y: number) => {
    setShapes(
      shapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='main-container'>
        <ControlPanel
          onGenerate={(width, height, shape) =>
            handleGenerate(width, height, shape)
          }
          onRotate={rotateShape}
        />
        <Canvas onDrop={moveShape}>
          {shapes.map((shape) => (
            <Box
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              type={shape.type}
              rotation={shape.rotation}
              onMove={moveShape}
              isSelected={selectedShape === shape.id}
              onClick={selectShape}
              resizable={true}
              onResize={resizeShape}
            />
          ))}
        </Canvas>
      </div>
    </DndProvider>
  );
};

export default App;
