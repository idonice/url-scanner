import React, { useEffect, useState } from "react";

type Props = {
  urlId: string;
};

type UrlData = {
  title: string;
  screenshot?: string;
  status: string;
};

const Results: React.FC<Props> = ({ urlId }) => {
  const [data, setData] = useState<UrlData | null>(null);

  useEffect(() => {
    if (!urlId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:3001/url-scanner/${urlId}`);
      const result = await res.json();
      setData(result);

      // עצור פולינג כשהסטטוס הוא "done"
      if (result.status === "done") {
        clearInterval(interval);
      }
    }, 2000); // כל 2 שניות

    return () => clearInterval(interval);
  }, [urlId]);

  if (!data) return <p>Scanning...</p>;

  return (
    <div
      style={{
        color: "white",
        overflow: "hidden",
        width: "400px",
        height: "600px",
      }}
    >
      <h4>{data.title}</h4>
      {data.status === "done" && data.screenshot && (
        <img
          src={data.screenshot}
          alt="Screenshot"
          style={{ maxWidth: "400px" }}
        />
      )}
      {data.screenshot}
      {data.status !== "done" && <p>סורק את הדף...</p>}
    </div>
  );
};

export default Results;
