import { useState } from "react";
import "./styles/ControlPanel.scss";

interface ControlPanelProps {
  // allows ControlPanel to pass width, height, & shape up to parent component
  onGenerate: (
    width: number,
    height: number,
    shape: "rectangle" | "circle" | "triangle"
  ) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate }) => {
  // initialize dimensions to 0
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [shape, setShape] = useState<"rectangle" | "circle" | "triangle">(
    "rectangle"
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height, shape);
  };

  // 'onSubmit' calls 'handleSubmit', which calls 'onGenerate' with current state values
  return (
    <div className="control-panel">
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
      <button type='submit'>Generate</button>
    </form>
    </div>
  );
};

export default ControlPanel;
