import { useCallback, useEffect, useState } from "react";
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
  const [shapeWidth, setShapeWidth] = useState<number>(0);
  const [shapeHeight, setShapeHeight] = useState<number>(0);
  const [shapeRotation, setShapeRotation] = useState<number>(0);
  // const [rotationVersion, setRotationVersion] = useState<number>(0);
  const resizeShape = (
    id: string,
    newWidth: number,
    newHeight: number,
    newX?: number,
    newY?: number
  ) => {
    setShapes(
      shapes.map((shape) => {
        if (shape.id === id) {
          return {
            ...shape,
            width: newWidth,
            height: newHeight,
            x: newX !== undefined ? newX : shape.x,
            y: newY !== undefined ? newY : shape.y,
          };
        }
        return shape;
      })
    );
  };

  // update ControlPanel when shape selected
  useEffect(() => {
    const selected = shapes.find((shape) => shape.id === selectedShape);
    if (selected) {
      setShapeWidth(selected.width);
      setShapeHeight(selected.height);
      setShapeRotation(selected.rotation || 0);
    } else {
      // reset if no shape selected
      setShapeWidth(0);
      setShapeHeight(0);
      setShapeRotation(0);
    }
  }, [selectedShape, shapes]);

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
      rotation: shapeRotation,
    };
    setShapes([...shapes, newShape]);
  };

  const selectShape = (id: string) => {
    setSelectedShape(id);
  };

  const rotateShape = useCallback(
    (angleDelta: number) => {
      if (selectedShape) {
        setTimeout(() => {
          setShapes((currentShapes) => {
            return currentShapes.map((shape) => {
              if (shape.id === selectedShape) {
                return {
                  ...shape,
                  rotation: (shape.rotation || 0) + angleDelta,
                };
              }
              return shape;
            });
          });
        }, 0);
      }
    },
    [selectedShape]
  );

  const moveShape = (id: string, x: number, y: number) => {
    setShapes(
      shapes.map((shape) => (shape.id === id ? { ...shape, x, y } : shape))
    );
  };

  const deleteShape = useCallback(() => {
    if (selectedShape) {
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => shape.id !== selectedShape)
      );
      setSelectedShape(null);
    }
  }, [selectedShape]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteShape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteShape]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className='mainContainer'
        // onClick={() => setSelectedShape(null)} // deselect shape
      >
        <ControlPanel
          onGenerate={(width, height, shape) =>
            handleGenerate(width, height, shape)
          }
          // onClick={() => setSelectedShape(null)} // deselect shape
          onRotate={rotateShape}
          width={shapeWidth}
          height={shapeHeight}
          rotation={shapeRotation}
          setWidth={setShapeWidth}
          setHeight={setShapeHeight}
          setRotation={setShapeRotation}
          onDelete={deleteShape}
        />
        <Canvas
          onDrop={moveShape}
          setSelectedShape={setSelectedShape}
        >
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
