import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, Button } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));
export default function CCASSForm(props) {
  const { control } = useFormContext();

  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Controller
          name="stock_code"
          label="stock code"
          control={control}
          defaultValue="1"
          render={(props) => (
            <TextField
              {...props}
              label="stock code"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />

        <Controller
          name="start_date"
          control={control}
          render={(props) => (
            <TextField
              {...props}
              label="start date"
              type="date"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <Controller
          name="end_date"
          control={control}
          render={(props) => (
            <TextField
              {...props}
              label="end date"
              type="date"
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        {props.showThreshold && (
          <Controller
            name="threshold"
            control={control}
            render={(props) => (
              <TextField
                {...props}
                label="threshold in %"
                type="number"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      </div>
      <Button type="submit" size="large" variant="contained" color="primary">
        Submit
      </Button>
    </>
  );
}
