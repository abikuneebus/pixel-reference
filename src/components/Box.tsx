import { useCallback, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { IShape } from "../types";
import "./styles/Box.scss";

interface BoxProps extends IShape {
  onMove: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onClick: (id: string) => void;
  resizable: boolean;
  onResize: (id: string, newWidth: number, newHeight: number) => void;
}

const Box: React.FC<BoxProps> = ({
  id,
  x,
  y,
  width,
  height,
  type,
  onMove,
  isSelected,
  onClick,
  rotation,
  resizable,
  onResize,
}) => {
  // drag and drop
  const [{ isDragging }, drag] = useDrag({
    type: "box",
    item: { id, x, y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newX = Math.round(item.x + delta.x);
        const newY = Math.round(item.y + delta.y);
        onMove(item.id, newX, newY);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // drag to resize
  const [resizing, setResizing] = useState(false);
  const [initialMouseX, SetInitialMouseX] = useState(0);
  const [initialMouseY, SetInitialMouseY] = useState(0);
  const [initialWidth, SetInitialWidth] = useState(width);
  const [initialHeight, SetInitialHeight] = useState(height);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (resizable) {
        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();

        // check if mouse is near bottom-right corner
        if (e.clientX >= rect.right - 10 && e.clientY >= rect.bottom - 10) {
          setResizing(true);
          SetInitialMouseX(e.clientX);
          SetInitialMouseY(e.clientY);
          SetInitialWidth(width);
          SetInitialHeight(height);
        } else {
          //ToDo: move shape selection logic here
        }
      }
    },
    [resizable, width, height]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const newWidth = initialWidth + (e.clientX - initialMouseX);
        const newHeight = initialHeight + (e.clientY - initialMouseY);
        onResize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (resizing) {
        setResizing(false);
        // ToDo: finalize resizing
      }
    };

    if (resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, initialMouseX, initialMouseY, initialWidth, initialHeight, onResize, id]);

  const baseClassName = "box";
  const shapeClassName = `${baseClassName} ${type}`;

  const positionStyle = {
    left: `${x}px`,
    top: `${y}px`,
    width: type !== "triangle" ? `${width}px` : undefined,
    height: type !== "triangle" ? `${height}px` : undefined,
    border: isSelected ? "2px solid #434aeb" : "none", // highlight selected shape
    opacity: isDragging ? 0.5 : 1,
    transform: `rotate(${rotation || 0}deg)`,
    transformOrigin: "center",
    boxSizing: "border-box" as const,
  };

  // attach drag ref to root element
  return (
    <div
      ref={drag}
      className={shapeClassName}
      style={positionStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={() => onClick(id)}
    />
  );
};

export default Box;
