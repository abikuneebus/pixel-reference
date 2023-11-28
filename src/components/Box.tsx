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
  setSelectedShape: (value: string | null) => void;
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
  setSelectedShape,
  color,
}) => {
  // drag to resize
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizing, setResizing] = useState<boolean>(false);
  const [initialMouseX, SetInitialMouseX] = useState(0);
  const [initialMouseY, SetInitialMouseY] = useState(0);
  const [initialWidth, SetInitialWidth] = useState(width);
  const [initialHeight, SetInitialHeight] = useState(height);
  const [initialX, setInitialX] = useState(x);
  const [initialY, setInitialY] = useState(y);

  const increaseOpacity = (
    color: string | undefined,
    amount: number
  ): string => {
    if (!color) {
      return "rgba(32, 57, 246, 0.87)"; // fallback
    }

    const colorParts = color.match(/[\d.]+/g);
    if (colorParts && colorParts.length === 4) {
      const increasedAlpha = Math.min(1, parseFloat(colorParts[3]) + amount);
      return `rgba(${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${increasedAlpha})`;
    }
    return color;
  };

  const displayColor = isSelected ? increaseOpacity(color, 0.2) : color;

  // differentiate between dragging and resizing
  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: string
  ) => {
    e.stopPropagation(); // prevent DnD logic
    if (resizable && isSelected) {
      setResizing(true);
      SetInitialMouseX(e.clientX);
      SetInitialMouseY(e.clientY);
      SetInitialWidth(width);
      SetInitialHeight(height);
      setInitialX(x);
      setInitialY(y);
      setResizeDirection(direction);
    }
  };

  // handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        let dx = e.clientX - initialMouseX;
        let dy = e.clientY - initialMouseY;

        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newX = initialX;
        let newY = initialY;

        switch (resizeDirection) {
          case "topLeft":
            newWidth -= dx;
            newHeight -= dy;
            newX += dx;
            newY += dy;
            break;
          case "topRight":
            newWidth += dx;
            newHeight -= dy;
            newY += dy;
            break;
          case "bottomLeft":
            newWidth -= dx;
            newHeight += dy;
            newX += dx;
            break;
          case "bottomRight":
            newWidth += dx;
            newHeight += dy;
            break;
          default:
            break;
        }

        onResize(id, newWidth, newHeight, newX, newY);
      }
    };

    // handle resize stop
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
    resizeDirection,
  ]);

  // handle relocation
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

  // apply style changes
  const positionStyle = {
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    border: isSelected ? "1.5px solid #434AEB8A" : "none", // selected shape indication
    opacity: isDragging ? 0.5 : 1,
    transform: `rotate(${rotation || 0}deg)`,
    transformOrigin: "center",
    boxSizing: "border-box" as const,
    backgroundColor: displayColor,
  };

  const handleOnClick = () => {
    setSelectedShape(id);
  };

  return (
    <div
      ref={drag}
      className={`${shapeClassName} ${isSelected ? "selected" : ""}`}
      style={positionStyle}
      onMouseUp={() => {
        handleOnClick();
        setResizing(false); // stop resizing on mouse-up
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {isSelected && resizable && (
        <>
          <div
            className='topLeft'
            onMouseDown={(e) => handleResizeMouseDown(e, "topLeft")}
          />
          <div
            className='topRight'
            onMouseDown={(e) => handleResizeMouseDown(e, "topRight")}
          />
          <div
            className='bottomRight'
            onMouseDown={(e) => handleResizeMouseDown(e, "bottomRight")}
          />
          <div
            className='bottomLeft'
            onMouseDown={(e) => handleResizeMouseDown(e, "bottomLeft")}
          />
        </>
      )}
    </div>
  );
};

export default Box;
