import React, { useCallback, useEffect, useState } from "react";
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
  const [rotationInterval, setRotationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [shape, setShape] = useState<"rectangle" | "circle" | "triangle">(
    "rectangle"
  );

  // debounce hook
  const useDebounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number
  ) => {
    const [debouncedFunc, setDebouncedFunc] = useState<
      (...args: Parameters<F>) => void
    >(() => func);

    useEffect(() => {
      const handler = setTimeout(() => setDebouncedFunc(() => func), delay);

      return () => {
        clearTimeout(handler);
      };
    }, [func, delay]);

    return debouncedFunc;
  };

  // debounced shape generation
  const debouncedHandleGenerate = useDebounce(
    (
      width: number,
      height: number,
      shape: "rectangle" | "circle" | "triangle"
    ) => {
      onGenerate(width, height, shape);
    },
    300
  );

  // key press handler
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (selectedShapeExists) {
          onUpdateShape(width, height, rotation);
        } else {
          debouncedHandleGenerate(width, height, shape);
        }
      }
    },
    [
      width,
      height,
      rotation,
      shape,
      debouncedHandleGenerate,
      onUpdateShape,
      selectedShapeExists,
    ]
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

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ↓↓↓  TSX  ↓↓↓  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div className='controlPanelContainer'>
      <div className='shapeSelectPnl'>
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
      </div>
      <div className='numericalInputContainer'>
        <div className='dimensionsControlPnl'>
          <form onSubmit={handleSubmit}>
            <label className='dimensionsLbl widthLbl'>
              W (px)
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
            <label className='dimensionsLbl heightLbl'>
              H (px)
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
          </form>
        </div>
        <div className='rotationControlPnl'>
          <label className='rotationLbl'>Rotation (°)</label>
          <div className='rotationControls'>
            <button
              className='rotateIncrementBtn'
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
              className='rotateDecrementBtn'
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
        </div>
      </div>
      <div className='lifeCycleBtnsPnl'>
        <button
          className='generateBtn'
          type='submit'
          onClick={(e) => e.stopPropagation()}
        >
          Generate
        </button>
        <button
          className='deleteBtn'
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
