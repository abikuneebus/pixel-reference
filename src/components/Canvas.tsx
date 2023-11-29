import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import "./styles/Canvas.scss";

interface CanvasProps {
  onDrop: (id: string, left: number, top: number) => void; // update position on drop
  children: React.ReactNode;
  className?: string;
  setSelectedShape: (value: string | null) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  onDrop,
  children,
  className,
  setSelectedShape,
}) => {
  const [, drop] = useDrop({
    accept: "box",
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const left = Math.round(item.x + delta.x);
        const top = Math.round(item.y + delta.y);
        onDrop(item.id, left, top);
      }
    },
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
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            setSelectedShape,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Canvas;
