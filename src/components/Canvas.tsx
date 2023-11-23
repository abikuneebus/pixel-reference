import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "./styles/Canvas.scss";

interface CanvasProps {
  onDrop: (id: string, left: number, top: number) => void; // function to update position on drop
  children: React.ReactNode;
  className?: string; // ToDo: use it or lose it
  setSelectedShape: (value: string | null) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  onDrop,
  children,
  className,
  setSelectedShape,
}) => {
  const [, drop] = useDrop({
    accept: "box", // accepts the same type as defined in draggable items
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const left = Math.round(item.x + delta.x);
        const top = Math.round(item.y + delta.y);
        onDrop(item.id, left, top);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeCanvas = () => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      const width = Math.round((vw * 0.98) / 10) * 10;
      const height = Math.round((vh * 0.92) / 10) * 10;

      setCanvasSize({ width, height });
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // initialize canvas size

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ToDo: use it or lose it (line 30 'className')
  return (
    <div
      ref={drop}
      className={`canvas-container ${className || ""}`}
      style={{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
      }}
      onClick={() => setSelectedShape(null)}
    >
      {React.Children.map(children, (child) => {
        // Ensure the child is a valid React element
        if (React.isValidElement(child)) {
          // Clone the element with the additional prop
          return React.cloneElement(child as React.ReactElement, {
            setSelectedShape,
          });
        }
        return child;
      })}

      {/* {children} */}
    </div>
  );
};

export default Canvas;
