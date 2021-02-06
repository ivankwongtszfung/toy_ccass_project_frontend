import "./App.css";
import CanvasJSReact from "./lib/canvasjs.react";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@material-ui/core";

import ShareholdingGraph from "./CCASS/ShareholdingGraph";
import CCASSForm from "./CCASS/CCASSForm";
import TransactionFinder from "./CCASS/TransactionFinder";
import React, { useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}
function App() {
  const methods = useForm();
  const [param, setParam] = useState();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    methods.reset();
    setParam(null);
    setValue(newValue);
  };
  const onSubmit = (data) => {
    setParam(data);
  };
  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Top 10 Shareholding" />
          <Tab label="Transaction Finder" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CCASSForm />
          </form>
        </FormProvider>
        {param && (
          <ShareholdingGraph
            stock_code={param.stock_code}
            start_date={param.start_date}
            end_date={param.end_date}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CCASSForm showThreshold />
          </form>
        </FormProvider>
        {param && (
          <TransactionFinder
            stock_code={param.stock_code}
            start_date={param.start_date}
            end_date={param.end_date}
            threshold={param.threshold}
          />
        )}
      </TabPanel>
    </div>
  );
}

export { CanvasJSChart };
export default App;
