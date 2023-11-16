import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { IShape } from "../types";
import "./styles/Box.scss";

interface BoxProps extends IShape {
  onMove: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onClick: (id: string) => void;
  resizable: boolean;
  onResize: (
    id: string,
    newWidth: number,
    newHeight: number,
    newX?: number,
    newY?: number
  ) => void;
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
  // drag to resize
  const [resizing, setResizing] = useState<boolean>(false);
  const [initialMouseX, SetInitialMouseX] = useState(0);
  const [initialMouseY, SetInitialMouseY] = useState(0);
  const [initialWidth, SetInitialWidth] = useState(width);
  const [initialHeight, SetInitialHeight] = useState(height);
  const [initialX, setInitialX] = useState(x);
  const [initialY, setInitialY] = useState(y);

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // prevent DnD logic
    if (resizable && isSelected) {
      setResizing(true);
      SetInitialMouseX(e.clientX);
      SetInitialMouseY(e.clientY);
      SetInitialWidth(width);
      SetInitialHeight(height);
      setInitialX(x);
      setInitialY(y);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;

        let newWidth = initialWidth + dx;
        let newHeight = initialHeight + dy;
        let newX = initialX;
        let newY = initialY;

        // if resizing leftwards, adjust position & width
        if (newWidth < 0) {
          newX = initialX + newWidth;
          newWidth = Math.abs(newWidth);
        }

        // if resizing upwards, adjust position height
        if (newHeight < 0) {
          newY = initialY + newHeight;
          newHeight = Math.abs(newHeight);
        }

        onResize(id, newWidth, newHeight, newX, newY);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (resizing) {
        setResizing(false);
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
  }, [
    resizing,
    initialMouseX,
    initialMouseY,
    initialWidth,
    initialHeight,
    initialX,
    initialY,
    onResize,
    id,
  ]);

  // drag logic
  const [{ isDragging }, drag] = useDrag({
    type: "box",
    item: { id, x, y },
    canDrag: !resizing,
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

  const baseClassName = "box";
  const shapeClassName = `${baseClassName} ${type}`;

  const positionStyle = {
    left: `${x}px`,
    top: `${y}px`,
    width: type !== "triangle" ? `${width}px` : undefined,
    height: type !== "triangle" ? `${height}px` : undefined,
    border: isSelected ? "1.5px solid #434AEB8A" : "none", // selected shape indication
    opacity: isDragging ? 0.5 : 1,
    transform: `rotate(${rotation || 0}deg)`,
    transformOrigin: "center",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      ref={drag}
      className={`${shapeClassName} ${isSelected ? "selected" : ""}`}
      style={positionStyle}
      onMouseUp={() => {
        onClick(id);
        setResizing(false); // stop resizing on mouse-up
      }}
    >
      {isSelected && resizable && (
        <>
          <div
            className='bottom-right'
            onMouseDown={handleResizeMouseDown}
          />
        </>
      )}
    </div>
  );
};

export default Box;
