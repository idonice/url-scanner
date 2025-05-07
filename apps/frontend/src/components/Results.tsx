import React, { useEffect, useState } from "react";
import RiskScoreGauge from "./RiskScoreGauge";

type Props = {
  urlId: string;
};

type UrlData = {
  title: string;
  screenshot?: string;
  status: string;
  riskScore: number;
};

const Results: React.FC<Props> = ({ urlId }) => {
  const [data, setData] = useState<UrlData | null>(null);

  useEffect(() => {
    if (!urlId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:3001/url-scanner/${urlId}`);
      const result = await res.json();
      setData(result);

      if (result.status === "done") {
        clearInterval(interval);
      }
    }, 2000); // כל 2 שניות

    return () => clearInterval(interval);
  }, [urlId]);

  if (!data) return <div></div>;

  return (
    <div className="results">
      {data.status === "done" && <RiskScoreGauge score={data.riskScore} />}
      <h4 style={{ margin: 0 }}>{data.title}</h4>
      {data.status === "done" && data.screenshot && (
        <img
          src={data.screenshot}
          alt="Screenshot"
          style={{ maxWidth: "400px" }}
        />
      )}
      {data.status !== "done" && <p>סורק את הדף...</p>}
    </div>
  );
};

export default Results;
