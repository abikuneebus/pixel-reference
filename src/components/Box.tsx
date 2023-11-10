import { useDrag } from "react-dnd";
import { IShape } from "../types";
import "./styles/Box.scss";

interface BoxProps extends IShape {
  onMove: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onClick: (id: string) => void;
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
}) => {
  // set up drag hook
  console.log(rotation);
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
  };

  // attach drag ref to root element
  return (
    <div
      ref={drag}
      className={shapeClassName}
      style={positionStyle}
      onMouseUp={() => onClick(id)}
    />
  );
};

export default Box;
