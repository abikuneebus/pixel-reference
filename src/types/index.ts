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
}

export interface DraggableShapeProps {
  id: string;
  left: number;
  top: number;
}
