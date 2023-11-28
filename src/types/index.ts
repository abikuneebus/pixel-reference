// interface for generated shapes
export interface IShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  type: "rectangle" | "circle";
  resizable?: boolean;
  color?: string;
  zIndex?: number;
}

export interface DraggableShapeProps {
  id: string;
  left: number;
  top: number;
}
