import { IShape } from "../types";
import "./styles/Box.scss";

interface BoxProps extends IShape {
  // event handlers, etc.
}

const Box: React.FC<BoxProps> = ({ id, x, y, width, height, type }) => {
  const baseClassName = "box";
  // dynamically assign class names based on shape type
  const shapeClassName = `${baseClassName} ${type}`;

  // style for positioning box on canvas
  const positionStyle = {
    left: `${x}px`,
    top: `${y}px`,
    width: type !== "triangle" ? `${width}px` : undefined,
    height: type !== "triangle" ? `${height}px` : undefined,
    // for triangle, border is used to create shape; width & height should be 0
    borderWidth:
      type === "triangle" ? `${height}px ${width / 2}px 0` : undefined,
  };

  //ToDo: drag handling logic!

  return (
    <div
      className={shapeClassName}
      style={positionStyle}
    />
  );
};

export default Box;