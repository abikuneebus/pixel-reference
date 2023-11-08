// interface for generated shapes
export interface IShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  type: 'rectangle' | 'circle' | 'triangle';
}