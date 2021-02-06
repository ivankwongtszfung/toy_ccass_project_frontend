import React, { useState, useEffect } from "react";
import CustomMaterialTable from "../MaterialTable";
import { Alert, AlertTitle } from "@material-ui/lab";

export default function TransactionFinder(props) {
  const [transaction, setTransaction] = useState([]);
  const { stock_code, start_date, end_date, threshold } = props;
  const [open, setOpen] = React.useState("");
  const params = {
    stock_code,
    start_date,
    end_date,
    threshold,
  };

  React.useEffect(() => {
    console.log(params);
    const url = new URL("http://127.0.0.1:5000/ccass/shareholding_threshold");
    url.search = new URLSearchParams(params).toString();
    setTransaction([]);
    setOpen("");

    if (params.threshold) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw Error(`${response.statusText}`);
          }
          return response.json();
        })
        .then((responses) => {
          const result = [];
          Object.keys(responses).forEach(function (date) {
            Object.keys(responses[date]).forEach(function (participateId) {
              result.push({
                date,
                participateId,
                holdingChange: responses[date][participateId],
              });
            });
          });
          setTransaction(result);
        })
        .catch((error) => {
          setOpen(`Response not OK ${error}`);
          return;
        });
    }
  }, [params.stock_code, params.start_date, params.end_date, params.threshold]);
  return (
    <>
      {open && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {open}
        </Alert>
      )}
      <div style={{ maxWidth: "100%" }}>
        {transaction.length > 0 && (
          <CustomMaterialTable
            columns={[
              { title: "Date", field: "date", type: "datetime" },
              { title: "Participate Id", field: "participateId" },
              {
                title: "Changes in %",
                field: "holdingChange",
                type: "numeric",
              },
            ]}
            data={transaction}
            title="Transaction Finder"
          />
        )}
      </div>
    </>
  );
}
