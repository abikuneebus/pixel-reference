import React, { useCallback, useEffect, useState } from "react";
import "./styles/ControlPanel.scss";

interface ControlPanelProps {
  onGenerate: (
    width: number,
    height: number,
    shape: "rectangle" | "circle"
  ) => void;
  onUpdateShape: (width: number, height: number, rotation: number) => void;
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height, shape);
  };

  // handles rotation using '+' & '-' buttons
  const startRotating = (angleDelta: number) => {
    if (!rotationInterval) {
      const interval = setInterval(() => {
        onRotate(angleDelta);
      }, 100);
      setRotationInterval(interval);
    }
  };

  const stopRotating = () => {
    if (rotationInterval) {
      clearInterval(rotationInterval);
      setRotationInterval(null);
    }
  };

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

  const handleWidthBlur = () => {
    const newValue = localWidth === "" ? 0 : Number(localWidth);
    setWidthDirectly(newValue);
  };

  const handleHeightBlur = () => {
    const newValue = localHeight === "" ? 0 : Number(localHeight);
    setHeightDirectly(newValue);
  };

  const handleRotationBlur = () => {
    const newValue = localRotation === "" ? 0 : Number(localRotation);
    setRotationDirectly(newValue);
  };

  const handleWidthFocus = () => {
    setLocalWidth("");
  };

  const handleHeightFocus = () => {
    setLocalHeight("");
  };

  const handleRotationFocus = () => {
    setLocalRotation("");
  };

  const [localWidth, setLocalWidth] = useState<string>(width.toString());
  const [localHeight, setLocalHeight] = useState<string>(height.toString());
  const [localRotation, setLocalRotation] = useState<string>(
    rotation.toString()
  );

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

  return (
    <div className='controlPanelContainer'>
      <div className='siteLogoContainer'>
        <label className='siteLogo'>Pixel Reference Utility</label>
      </div>
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
          <form
            className='flexForm'
            onSubmit={handleSubmit}
          >
            <div className='formContainer'>
              <label className='dimensionsLbl widthLbl'>
                W (px)
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
            </div>
            <div className='formContainer'>
              <label className='dimensionsLbl heightLbl'>
                H (px)
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
            </div>
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
              onTouchStart={(e) => {
                e.stopPropagation();
                startRotating(-1);
              }}
              onTouchEnd={() => {
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
              onTouchStart={(e) => {
                e.stopPropagation();
                startRotating(1);
              }}
              onTouchEnd={() => {
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
