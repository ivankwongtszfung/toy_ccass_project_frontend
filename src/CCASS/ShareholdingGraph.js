import React, { useState, useEffect } from "react";

import { CanvasJSChart } from "../App";

export default function ShareholdingGraph(props) {
  const [shareholding, setShareholding] = useState([]);
  const { stock_code, start_date, end_date } = props;

  const params = {
    stock_code,
    start_date,
    end_date,
  };
  useEffect(() => {
    console.log(params);
    const url = new URL("http://127.0.0.1:8000/ccass/top_ten_shareholding");
    const parse_data = {};
    const id_name_mapping = {};
    url.search = new URLSearchParams(params).toString();

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((responses) => {
        Object.keys(responses).forEach(function (key) {
          console.log(key);
          responses[key].forEach((data, index) => {
            const participate_id = data["participant-id"];
            id_name_mapping[participate_id] = data["participant-name"];
            if (!(participate_id in parse_data)) {
              parse_data[participate_id] = [{ y: index + 1, x: new Date(key) }];
            } else {
              parse_data[participate_id].push({
                y: index + 1,
                x: new Date(key),
              });
            }
          });
          Object.keys(parse_data).forEach((participate_id) => {
            parse_data[participate_id].sort((a, b) => {
              return b["x"] - a["x"];
            });
          });
          console.log(parse_data);
        });
        const dataPoints = [];
        if (parse_data) {
          Object.keys(parse_data).map((participant) => {
            console.log(participant);
            dataPoints.push({
              type: "line",
              name: id_name_mapping[participant],
              showInLegend: true,
              dataPoints: parse_data[participant],
            });
          });
          console.log(dataPoints);
          setShareholding(dataPoints);
        }
      });
  }, [params.stock_code, params.start_date, params.end_date]);

  return (
    <div>
      {shareholding && (
        <CanvasJSChart
          options={{
            animationEnabled: true,
            itle: {
              text: "CCASS Shareholding",
            },
            axisY: {
              title: "Top 10 Shareholding",
              reversed: true,
            },
            toolTip: {
              shared: true,
            },
            data: shareholding,
          }}
        />
      )}
    </div>
  );
}
