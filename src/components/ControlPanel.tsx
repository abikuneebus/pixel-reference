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

  // keyboard-only accessibility
  const handleButtonKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

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

  // Directly set width, height, and rotation
  const setRotationDirectly = (newRotation: number) => {
    setRotation(newRotation);
    setLocalRotation(newRotation.toString());
  };
  const incrementRotation = () => setRotationDirectly(rotation + 1);
  const decrementRotation = () => setRotationDirectly(rotation - 1);

  const setWidthDirectly = (newWidth: number) => {
    setWidth(newWidth);
    setLocalWidth(newWidth.toString());
  };

  const setHeightDirectly = (newHeight: number) => {
    setHeight(newHeight);
    setLocalHeight(newHeight.toString());
  };

  // Handle blur events
  // Update global state on blur or enter key press
  const handleWidthBlur = () => {
    const newValue = localWidth === "" ? 0 : Number(localWidth);
    setWidthDirectly(newValue);
  };

  // Update global state on blur or enter key press
  const handleHeightBlur = () => {
    const newValue = localHeight === "" ? 0 : Number(localHeight);
    setHeightDirectly(newValue);
  };

  // Update global state on blur or enter key press
  const handleRotationBlur = () => {
    const newValue = localRotation === "" ? 0 : Number(localRotation);
    setRotationDirectly(newValue);
  };

  // Reset local state on focus
  const handleWidthFocus = () => {
    setLocalWidth("");
  };

  // Reset local state on focus
  const handleHeightFocus = () => {
    setLocalHeight("");
  };

  // Reset local state on focus
  const handleRotationFocus = () => {
    setLocalRotation("");
  };

  const [localWidth, setLocalWidth] = useState<string>(width.toString());
  const [localHeight, setLocalHeight] = useState<string>(height.toString());
  const [localRotation, setLocalRotation] = useState<string>(
    rotation.toString()
  );

  // Handle input change events
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalWidth(e.target.value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHeight(e.target.value);
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRotation(e.target.value);
  };

  useEffect(() => {
    setLocalWidth(width.toString());
    setLocalHeight(height.toString());
    setLocalRotation(rotation.toString());
  }, [width, height, rotation]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const widthValue = localWidth === "" ? 0 : Number(localWidth);
        const heightValue = localHeight === "" ? 0 : Number(localHeight);
        const rotationValue = localRotation === "" ? 0 : Number(localRotation);

        if (widthValue > 0 && heightValue > 0) {
          if (selectedShapeExists) {
            onUpdateShape(widthValue, heightValue, rotationValue);
          } else {
            debouncedHandleGenerate(widthValue, heightValue, shape);
          }
        }
      }
    },
    [
      localWidth,
      localHeight,
      localRotation,
      shape,
      debouncedHandleGenerate,
      onUpdateShape,
      selectedShapeExists,
    ]
  );

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ↓↓↓  TSX  ↓↓↓  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div className='controlPanelContainer'>
      <div className='shapeSelectPnl'>
        <div
          className={`rectangleBtn ${shape === "rectangle" ? "selected" : ""}`}
          onClick={() => setShape("rectangle")}
          onKeyDown={(e) =>
            handleButtonKeyPress(e, () => setShape("rectangle"))
          }
          tabIndex={6}
        ></div>
        <div
          className={`circleBtn ${shape === "circle" ? "selected" : ""}`}
          onClick={() => setShape("circle")}
          onKeyDown={(e) => handleButtonKeyPress(e, () => setShape("circle"))}
          tabIndex={7}
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
                value={localWidth}
                onChange={handleWidthChange}
                onFocus={handleWidthFocus}
                onBlur={handleWidthBlur}
                onKeyDown={handleKeyPress}
                tabIndex={1}
              />
            </label>
            <label className='dimensionsLbl heightLbl'>
              H (px)
              {/* 'onChange' handler updates 'height' state with new values */}
              <input
                type='number'
                value={localHeight}
                onChange={handleHeightChange}
                onFocus={handleHeightFocus}
                onBlur={handleHeightBlur}
                onKeyDown={handleKeyPress}
                tabIndex={2}
              />
            </label>
          </form>
        </div>
        <div className='rotationControlPnl'>
          <label className='rotationLbl'>Rotation (°)</label>
          <div className='rotationControls'>
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
              tabIndex={4}
            >
              -
            </button>
            <input
              type='number'
              value={localRotation}
              onChange={handleRotationChange}
              onFocus={handleRotationFocus}
              onBlur={handleRotationBlur}
              onKeyDown={handleKeyPress}
              tabIndex={3}
            />
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
              tabIndex={5}
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
          onClick={handleSubmit}
          tabIndex={8}
        >
          Generate
        </button>
        <button
          className='deleteBtn'
          onClick={onDelete}
          tabIndex={9}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
