import React, { useState, useEffect } from "react";

import CustomMaterialTable from "../MaterialTable";
import { CanvasJSChart } from "../App";
import { Alert, AlertTitle } from "@material-ui/lab";

export default function ShareholdingGraph(props) {
  const [shareholding, setShareholding] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { stock_code, start_date, end_date } = props;
  const [open, setOpen] = React.useState("");

  const params = {
    stock_code,
    start_date,
    end_date,
  };
  useEffect(() => {
    console.log(params);
    const url = new URL(`${process.env.NODE_ENV}/ccass/top_ten_shareholding`);
    const parse_data = {};
    const id_name_mapping = {};
    url.search = new URLSearchParams(params).toString();
    setShareholding([]);
    setTableData([]);
    setOpen("");

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(`${response.statusText}`);
        }
        return response.json();
      })
      .then((responses) => {
        console.log(responses);
        const parseTableData = [];
        Object.keys(responses).forEach(function (date) {
          responses[date].forEach((data, index) => {
            const ranking = index + 1;
            parseTableData.push({
              date: date,
              ...data,
              ranking,
            });
            const participate_id = data["participant-id"];
            id_name_mapping[participate_id] = data["participant-name"];
            if (!(participate_id in parse_data)) {
              parse_data[participate_id] = [{ y: ranking, x: new Date(date) }];
            } else {
              parse_data[participate_id].push({
                y: ranking,
                x: new Date(date),
              });
            }
          });
          setTableData(parseTableData);
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
      })
      .catch((error) => {
        setOpen(`Response not OK ${error}`);
        return;
      });
  }, [params.stock_code, params.start_date, params.end_date]);

  return (
    <>
      {open && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {open}
        </Alert>
      )}
      <div>
        {shareholding.length > 0 && (
          <>
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
            <CustomMaterialTable
              columns={[
                { title: "Date", field: "date", type: "datetime" },
                { title: "Participate Id", field: "participant-id" },
                { title: "Participate Name", field: "participant-name" },
                {
                  title: "Shareholding",
                  field: "shareholding",
                  type: "numeric",
                },
                {
                  title: "shareholding percent",
                  field: "shareholding-percent",
                  type: "numeric",
                },
              ]}
              data={tableData}
              title="top 10 participate"
              options={{
                filtering: true,
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
