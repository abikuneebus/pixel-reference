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
  const [resizing, setResizing] = useState<"top-left" | "bottom-right" | null>(
    null
  );
  const [initialMouseX, SetInitialMouseX] = useState(0);
  const [initialMouseY, SetInitialMouseY] = useState(0);
  const [initialWidth, SetInitialWidth] = useState(width);
  const [initialHeight, SetInitialHeight] = useState(height);
  const [initialX, setInitialX] = useState(x);
  const [initialY, setInitialY] = useState(y);

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // prevent DnD logic
    if (resizable && isSelected) {
      const handleClass = e.currentTarget.classList.contains("top-left")
        ? "top-left"
        : "bottom-right";
      setResizing(handleClass);
      SetInitialMouseX(e.clientX);
      SetInitialMouseY(e.clientY);
      SetInitialWidth(width);
      SetInitialHeight(height);
      if (handleClass === "top-left") {
        setInitialX(x);
        setInitialY(y);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;

        if (resizing === "bottom-right") {
          const newWidth = Math.max(initialWidth + dx, 10); // min width
          const newHeight = Math.max(initialHeight + dy, 10); // min height
          onResize(id, newWidth, newHeight);
        } else if (resizing === "top-left") {
          const newWidth = Math.max(initialWidth - dx, 10);
          const newHeight = Math.max(initialHeight - dy, 10);
          const newX = initialX + dx;
          const newY = initialY + dy;
          onResize(id, newWidth, newHeight, newX, newY);
        }
        //
        //         const newWidth = initialWidth + (e.clientX - initialMouseX);
        //         const newHeight = initialHeight + (e.clientY - initialMouseY);
        //         onResize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (resizing) {
        setResizing(null);
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
    border: isSelected ? "2px solid #434AEB7A" : "none", // selected shape indication
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
        setResizing(null); // stop resizing on mouse-up
      }}
    >
      {isSelected && resizable && (
        <>
          <div
            className='top-left'
            onMouseDown={handleResizeMouseDown}
          />
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
