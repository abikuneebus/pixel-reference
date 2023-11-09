import { useDrop } from "react-dnd";
import "./styles/Canvas.scss";

interface CanvasProps {
  onDrop: (id: string, left: number, top: number) => void; // function to update position on drop
  children: React.ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({ onDrop, children }) => {
  // set up drop hook
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

  return (
    <div
      ref={drop}
      className='canvas-container'
    >
      {children}
    </div>
  );
};

export default Canvas;
