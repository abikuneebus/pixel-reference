import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { IShape } from "../types";
import { isMobile } from "../utils/utils";
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
  zIndex?: number;
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
  zIndex,
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
    e.stopPropagation(); // prevent DnD
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

  const handleResizeTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    direction: string
  ) => {
    e.stopPropagation(); // prevent DnD
    if (resizable && isSelected) {
      setResizing(true);
      const touch = e.touches[0];
      SetInitialMouseX(touch.clientX);
      SetInitialMouseY(touch.clientY);
      SetInitialWidth(width);
      SetInitialHeight(height);
      setInitialX(x);
      setInitialY(y);
      setResizeDirection(direction);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResizeTouchMove = (e: TouchEvent) => {
    if (resizing) {
      const touch = e.touches[0];
      let dx = touch.clientX - initialMouseX;
      let dy = touch.clientY - initialMouseY;

      // resizing
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResizeTouchEnd = () => {
    if (resizing) {
      setResizing(false);
    }
  };

  useEffect(() => {
    // mouse event handlers
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

    const handleMouseUp = (e: MouseEvent) => {
      if (resizing) {
        setResizing(false);
      }
    };

    // touch event handlers
    const handleTouchMove = (e: TouchEvent) => handleResizeTouchMove(e);
    const handleTouchEnd = (e: TouchEvent) => handleResizeTouchEnd();

    if (resizing) {
      if (isMobile()) {
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);
      } else {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }
    }

    return () => {
      if (resizing) {
        if (isMobile()) {
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("touchend", handleTouchEnd);
        } else {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        }
      }
    };
  }, [
    resizing,
    id,
    initialMouseX,
    initialMouseY,
    initialWidth,
    initialHeight,
    initialX,
    initialY,
    onResize,
    resizeDirection,
    handleResizeTouchMove,
    handleResizeTouchEnd,
  ]);

  const [{ isDragging }, drag] = useDrag({
    type: "box",
    item: { id, x, y },
    canDrag: !resizing,
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
    zIndex: zIndex,
  };

  const handleOnClick = () => {
    onClick(id);
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
            onTouchStart={(e) => handleResizeTouchStart(e, "topLeft")}
          />
          <div
            className='topRight'
            onMouseDown={(e) => handleResizeMouseDown(e, "topRight")}
            onTouchStart={(e) => handleResizeTouchStart(e, "topRight")}
          />
          <div
            className='bottomRight'
            onMouseDown={(e) => handleResizeMouseDown(e, "bottomRight")}
            onTouchStart={(e) => handleResizeTouchStart(e, "bottomRight")}
          />
          <div
            className='bottomLeft'
            onMouseDown={(e) => handleResizeMouseDown(e, "bottomLeft")}
            onTouchStart={(e) => handleResizeTouchStart(e, "bottomLeft")}
          />
        </>
      )}
    </div>
  );
};

export default Box;
