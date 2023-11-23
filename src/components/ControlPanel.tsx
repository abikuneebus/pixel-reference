import React, { useCallback, useEffect, useState } from "react";
import "./styles/ControlPanel.scss";

interface ControlPanelProps {
  // allows ControlPanel to pass width, height, & shape up to parent component
  onGenerate: (
    width: number,
    height: number,
    shape: "rectangle" | "circle"
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
  const [shape, setShape] = useState<"rectangle" | "circle">("rectangle");

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
    (width: number, height: number, shape: "rectangle" | "circle") => {
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

  // generates shape
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height, shape);
  };

  useEffect(() => {
    setDisplayRotation(rotation.toString());
  }, [rotation]);

  const updateRotation = (angleDelta: number) => {
    setRotation((currentRotation) => {
      let newRotation = currentRotation + angleDelta;
      // Adjust for the -180 to 180 range
      if (newRotation > 180) {
        newRotation -= 360;
      } else if (newRotation < -180) {
        newRotation += 360;
      }
      return newRotation;
    });
  };

  //! ToDo: MOVE UP
  const [lastUpdate, setLastUpdate] = useState({ width, height, rotation });

  const [displayWidth, setDisplayWidth] = useState("");
  const [displayHeight, setDisplayHeight] = useState("");
  const [displayRotation, setDisplayRotation] = useState("");

  // Handler for width input focus
  const handleWidthFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (width === 0) {
      setDisplayWidth(""); // Set display to empty if actual value is 0
    }
  };

  // Handler for width input change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayWidth(e.target.value); // Update display value
    const newWidth = e.target.value === "" ? 0 : Number(e.target.value);
    setWidth(newWidth); // Update actual value
  };

  // Handler for height input focus
  const handleHeightFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (height === 0) {
      setDisplayHeight(""); // Set display to empty if actual value is 0
    }
  };

  // Handler for height input change
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayHeight(e.target.value); // Update display value
    const newHeight = e.target.value === "" ? 0 : Number(e.target.value);
    setHeight(newHeight); // Update actual value
  };

  // Handler for rotation input focus
  const handleRotationFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (rotation === 0) {
      setDisplayRotation(""); // Set display to empty if actual value is 0
    }
  };

  // Handler for rotation input change
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayRotation(e.target.value); // Update display value
    const newRotation = e.target.value === "" ? 0 : Number(e.target.value);
    setRotation(newRotation); // Update actual value
  };

  useEffect(() => {
    if (
      selectedShapeExists &&
      (lastUpdate.width !== width ||
        lastUpdate.height !== height ||
        lastUpdate.rotation !== rotation)
    ) {
      onUpdateShape(width, height, rotation);
      setLastUpdate({ width, height, rotation });
    }
  }, [rotation, width, height, onUpdateShape, selectedShapeExists, lastUpdate]);

  const startRotating = (angleDelta: number) => {
    stopRotating(); // Clear any existing interval
    setRotationInterval(
      setInterval(() => {
        updateRotation(angleDelta);
      }, 100)
    ); // Adjust time as needed
  };

  const stopRotating = () => {
    if (rotationInterval) {
      clearInterval(rotationInterval);
      setRotationInterval(null);
    }
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ↓↓↓  TSX  ↓↓↓  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div className='controlPanelContainer'>
      <div className='shapeSelectPnl'>
        <div
          className={`rectangleBtn ${shape === "rectangle" ? "selected" : ""}`}
          onClick={() => setShape("rectangle")}
        ></div>
        <div
          className={`circleBtn ${shape === "circle" ? "selected" : ""}`}
          onClick={() => setShape("circle")}
        ></div>
      </div>
      <div className='numericalInputContainer'>
        <div className='dimensionsControlPnl'>
          <form onSubmit={handleSubmit}>
            <label className='dimensionsLbl widthLbl'>
              W (px)
              {/* 'onChange' handler updates 'width' state with new values */}
              <input
                type='number'
                onKeyDown={handleKeyPress}
                value={displayWidth}
                onFocus={handleWidthFocus}
                onChange={handleWidthChange}
              />
            </label>
            <label className='dimensionsLbl heightLbl'>
              H (px)
              {/* 'onChange' handler updates 'height' state with new values */}
              <input
                type='number'
                onKeyDown={handleKeyPress}
                value={displayHeight}
                onFocus={handleHeightFocus}
                onChange={handleHeightChange}
              />
            </label>
          </form>
        </div>
        <div className='rotationControlPnl'>
          <label className='rotationLbl'>Rotation (°)</label>
          <div className='rotationControls'>
            <button
              className='rotateDecrementBtn'
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

            <input
              type='number'
              onKeyDown={handleKeyPress}
              value={displayRotation}
              onFocus={handleRotationFocus}
              onChange={handleRotationChange}
            />
            <button
              className='rotateIncrementBtn'
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
