import { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.scss";
import Box from "./components/Box";
import Canvas from "./components/Canvas";
import ControlPanel from "./components/ControlPanel";
import ThemeToggle from "./components/ThemeToggle";
import { IShape } from "./types";

const App: React.FC = () => {
  const [shapes, setShapes] = useState<IShape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [shapeWidth, setShapeWidth] = useState<number>(0);
  const [shapeHeight, setShapeHeight] = useState<number>(0);
  const [shapeRotation, setShapeRotation] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState<number>(0);

  const shapeColors = [
    "rgba(255, 23, 68, 0.63)", // red
    "rgba(244, 143, 177, 0.63)", // pink
    "rgba(173, 20, 87, 0.63)", // magenta
    "rgba(156, 39, 176, 0.63)", // purple
    "rgba(63, 81, 181, 0.63)", // blue
    "rgba(24, 255, 255, 0.63)", // light blue
    "rgba(3, 169, 244, 0.63)", // cyan
    "rgba(0, 150, 136, 0.63)", // teal
    "rgba(56, 190, 60, 0.63)", // green
    "rgba(118, 255, 3, 0.63)", // lime
    "rgba(255, 255, 0, 0.63)", // yellow
    "rgba(255, 193, 7, 0.63)", // amber
    "rgba(255, 152, 0, 0.63)", // orange
    "rgba(255, 87, 34, 0.63)", // deep orange
  ];

  // const getRandomColor = () => {
  //   const randomColorIndex = Math.floor(Math.random() * shapeColors.length);
  //   return shapeColors[randomColorIndex];
  // };

  const getNextColor = () => {
    const color = shapeColors[currentColorIndex];
    setCurrentColorIndex((currentColorIndex + 1) % shapeColors.length);
    return color;
  };

  useEffect(() => {
    const randomColorIndex = Math.floor(Math.random() * shapeColors.length);
    setCurrentColorIndex(randomColorIndex);
  }, [shapeColors.length]);

  // light/dark mode control
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const updateShape = (
    newWidth: number,
    newHeight: number,
    newRotation: number
  ) => {
    if (selectedShape) {
      setShapes(
        shapes.map((shape) =>
          shape.id === selectedShape
            ? {
                ...shape,
                width: newWidth,
                height: newHeight,
                rotation: newRotation,
              }
            : shape
        )
      );
    }
  };

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

  const isSelectedShape = !!selectedShape;

  const handleGenerate = (
    width: number,
    height: number,
    shape: "rectangle" | "circle"
  ) => {
    const color = getNextColor();
    const newShape: IShape = {
      id: `shape-${shapes.length + 1}`,
      x: 50,
      y: 50,
      width: width,
      height: height,
      type: shape,
      rotation: shapeRotation,
      color: color,
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
      <div className={`mainContainer ${isDarkMode ? "dark" : "light"}`}>
        <ThemeToggle
          onToggle={toggleTheme}
          isDarkMode={isDarkMode}
        ></ThemeToggle>
        <ControlPanel
          onGenerate={handleGenerate}
          onUpdateShape={updateShape}
          onRotate={rotateShape}
          width={shapeWidth}
          height={shapeHeight}
          rotation={shapeRotation}
          setWidth={setShapeWidth}
          setHeight={setShapeHeight}
          setRotation={setShapeRotation}
          onDelete={deleteShape}
          selectedShapeExists={isSelectedShape}
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
              color={shape.color}
              onMove={moveShape}
              isSelected={selectedShape === shape.id}
              onClick={selectShape}
              resizable={true}
              onResize={resizeShape}
              setSelectedShape={setSelectedShape}
            />
          ))}
        </Canvas>
      </div>
    </DndProvider>
  );
};

export default App;
