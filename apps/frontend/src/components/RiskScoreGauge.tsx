import React from "react";
import GaugeComponent from "react-gauge-component";

type Props = {
  score: number;
};

const RiskScoreGauge: React.FC<Props> = ({ score }) => {
  return (
    <div style={{ width: 200 }}>
      <GaugeComponent
        value={score}
        maxValue={100}
        type="semicircle"
        arc={{
          colorArray: ["#00cc88", "#f7e400", "#ff4444"],
          subArcs: [{ limit: 30 }, { limit: 70 }, { limit: 100 }],
          padding: 0.02,
          width: 0.2,
        }}
        labels={{
          tickLabels: { hideMinMax: true },
          valueLabel: {
            formatTextValue: (value) => `${value}% risks`,
          },
        }}
      />
    </div>
  );
};
export default RiskScoreGauge;
