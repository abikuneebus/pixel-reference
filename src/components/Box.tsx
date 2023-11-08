import { useDrag } from "react-dnd";
import { IShape } from "../types";
import "./styles/Box.scss";

interface BoxProps extends IShape {
  onMove: (id: string, x: number, y: number) => void; // updates position in parent state
}

const Box: React.FC<BoxProps> = ({ id, x, y, width, height, type, onMove }) => {
  // set up drag hook
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
    borderWidth:
      type === "triangle"
        ? `0 ${width / 2}px ${height}px ${width / 2}px`
        : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  // attach drag ref to root element
  return (
    <div
      ref={drag}
      className={shapeClassName}
      style={positionStyle}
    />
  );
};

export default Box;
