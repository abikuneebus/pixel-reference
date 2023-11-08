import "./styles/Canvas.scss";

interface CanvasProps {
  children: React.ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({ children }) => {
  return <div className='canvas-container'>{children}</div>;
};

export default Canvas;
