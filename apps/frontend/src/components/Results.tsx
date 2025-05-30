import React, { useEffect, useState } from "react";
import RiskScoreGauge from "./RiskScoreGauge";
import { ClipLoader } from "react-spinners";

type Props = {
  urlId: string;
};

type UrlData = {
  title: string;
  screenshot?: string;
  status: string;
  riskScore: number;
  risksDescription: string[];
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
      {data.status !== "done" && (
        <div className="loading-box">
          <ClipLoader color="#00cc88" loading={true} size={100} />
          <p>Scanning</p>
        </div>
      )}
      <h4 style={{ margin: 0 }}>{data.title}</h4>
      {data.status === "done" && data.screenshot && (
        <div
          style={{ height: "400px", overflow: "hidden", borderRadius: "10px" }}
        >
          <img
            src={data.screenshot}
            alt="Screenshot"
            style={{ width: "100%" }}
          />
        </div>
      )}
      <div className="risks-container">
        {data.status === "done" && data.risksDescription.length > 0 ? (
          <div className="results-container__text">
            <p>
              <b>Risks description:</b>
            </p>
            <ul>
              {data.risksDescription.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
        {data.status === "done" && <RiskScoreGauge score={data.riskScore} />}
      </div>
    </div>
  );
};

export default Results;
