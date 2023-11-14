import { useDrop } from "react-dnd";
import "./styles/Canvas.scss";

interface CanvasProps {
  onDrop: (id: string, left: number, top: number) => void; // function to update position on drop
  children: React.ReactNode;
  className?: string; // ToDo: use it or lose it
}

const Canvas: React.FC<CanvasProps> = ({ onDrop, children, className }) => {
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

  // ToDo: use it or lose it (line 30 'className')
  return (
    <div
      ref={drop}
      className={`canvas-container ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default Canvas;
