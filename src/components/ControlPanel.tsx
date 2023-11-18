import { useState } from "react";
import "./styles/ControlPanel.scss";

interface ControlPanelProps {
  // allows ControlPanel to pass width, height, & shape up to parent component
  onGenerate: (
    width: number,
    height: number,
    shape: "rectangle" | "circle" | "triangle"
  ) => void;
  onRotate: (angleDelta: number) => void;
  width: number;
  height: number;
  rotation: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  onClick: () => void;
}
const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onRotate,
  width,
  height,
  rotation,
  setWidth,
  setHeight,
  setRotation,
}) => {
  // initialize dimensions to 0
  const [rotationInterval, setRotationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [shape, setShape] = useState<"rectangle" | "circle" | "triangle">(
    "rectangle"
  );

  // generates shape
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height, shape);
  };

  // handle rotation
  const startRotating = (angleDelta: number) => {
    if (!rotationInterval) {
      const interval = setInterval(() => {
        onRotate(angleDelta);
      }, 100); //! ToDo: tweak as needed
      setRotationInterval(interval);
    }
  };

  const stopRotating = () => {
    if (rotationInterval) {
      clearInterval(rotationInterval);
      setRotationInterval(null);
    }
  };

  // 'onSubmit' calls 'handleSubmit', which calls 'onGenerate' with current state values
  return (
    <div className='control-panel'>
      <div className='generation'>
        <form onSubmit={handleSubmit}>
          <select
            value={shape}
            onChange={(e) =>
              setShape(e.target.value as "rectangle" | "circle" | "triangle")
            }
          >
            <option value='rectangle'>Rectangle</option>
            <option value='circle'>Circle</option>
            {/* <option value='triangle'>Triangle</option> */}
          </select>
          <label>
            W (px):
            {/* 'onChange' handler updates 'width' state with new values */}
            <input
              type='number'
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label>
            H (px):
            {/* 'onChange' handler updates 'height' state with new values */}
            <input
              type='number'
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
          <button
            type='submit'
            onClick={(e) => e.stopPropagation()}
          >
            Generate
          </button>
        </form>
      </div>
      <div className='adjustment'>
        <div className='rotation'>
          <button
            className='rotateIncrementButton'
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => {
              startRotating(1);
            }}
            onMouseUp={() => {
              stopRotating();
            }}
            onMouseLeave={() => {
              stopRotating();
            }}
          >
            +
          </button>
          <input
            type='number'
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
          <button
            className='rotateDecrementButton'
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => {
              startRotating(-1);
            }}
            onMouseUp={() => {
              stopRotating();
            }}
            onMouseLeave={() => {
              stopRotating();
            }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
