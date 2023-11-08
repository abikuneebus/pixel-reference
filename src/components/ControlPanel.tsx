import { useState } from "react";

interface ControlPanelProps {
  // allows `ControlPanel` to pass 'width' & 'height' upwards, to parent component
  onGenerate: (width: number, height: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate }) => {
  // initialize dimensions to 0
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(width, height);
  };

  // 'onSubmit' calls 'handleSubmit', which calls 'onGenerate' with current state values
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Width (px):
        {/* 'onChange' handler updates 'width' state with new values */}
        <input
          type='number'
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <label>
        Height (px):
        {/* 'onChange' handler updates 'height' state with new values */}
        <input
          type='number'
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </label>
      <button type='submit'>Generate</button>
    </form>
  );
};

export default ControlPanel;
