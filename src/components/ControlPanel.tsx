import { useState } from "react";
import "./styles/ControlPanel.scss";

interface ControlPanelProps {
  // allows ControlPanel to pass width, height, & shape up to parent component
  onGenerate: (
    width: number,
    height: number,
    shape: "rectangle" | "circle" | "triangle"
  ) => void;
  // manually entering dimensions/rotation
  onUpdateShape: (width: number, height: number, rotation: number) => void;
  // using rotate buttons
  onRotate: (angleDelta: number) => void;
  width: number;
  height: number;
  rotation: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  onDelete: () => void;
  selectedShapeExists: boolean;
}
const ControlPanel: React.FC<ControlPanelProps> = ({
  onGenerate,
  onRotate,
  onUpdateShape,
  width,
  height,
  rotation,
  setWidth,
  setHeight,
  setRotation,
  onDelete,
  selectedShapeExists,
}) => {
  // ToDO: pass to 'Box'
  // const [selectedShapeExists, setSelectedShapeExists] =
  //   useState<boolean>(false);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (selectedShapeExists) {
        onUpdateShape(width, height, rotation);
      } else {
        onGenerate(width, height, shape);
      }
    }
  };

  // initialize dimensions to 0
  const [rotationInterval, setRotationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [shape, setShape] = useState<"rectangle" | "circle" | "triangle">(
    "rectangle"
  );

  // handles directly input rotation value using input field
  const handleRotationChange = (newAngle: number) => {
    // set 0-359 range
    if (newAngle < 0) {
      newAngle = 359;
    } else if (newAngle > 359) {
      newAngle = 0;
    }
    setRotation(newAngle);
  };

  // generates shape
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height, shape);
  };

  // handles rotation using '+' & '-' buttons
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

  const incrementRotation = () => handleRotationChange(rotation + 1);
  const decrementRotation = () => handleRotationChange(rotation - 1);

  // 'onSubmit' calls 'handleSubmit', which calls 'onGenerate' with current state values
  return (
    <div className='controlPanelContainer'>
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
              onKeyDown={handleKeyPress}
              onChange={(e) => setWidth(Number(e.target.value))}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setWidth(0);
                  e.target.value = "0";
                }
              }}
            />
          </label>
          <label>
            H (px):
            {/* 'onChange' handler updates 'height' state with new values */}
            <input
              type='number'
              value={height}
              onKeyDown={handleKeyPress}
              onChange={(e) => setHeight(Number(e.target.value))}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setHeight(0);
                  e.target.value = "0";
                }
              }}
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
        <button>Lorem</button> {/* replace with feature */}
        {/* //* rotation controls */}
        <div className='rotationControlContainer'>
          <button
            className='rotateIncrementButton'
            onClick={(e) => {
              e.stopPropagation();
              incrementRotation();
            }}
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
            onKeyDown={handleKeyPress}
            onChange={(e) => setRotation(Number(e.target.value))}
            onFocus={(e) => {
              if (e.target.value === "0") {
                e.target.value = "";
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setRotation(0);
                e.target.value = "0";
              }
            }}
          />
          <button
            className='rotateDecrementButton'
            onClick={(e) => {
              e.stopPropagation();
              decrementRotation();
            }}
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
        <button
          className='deleteButton'
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
