import React from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function BasicDatePicker({value, onChange}) {

   return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
         <DatePicker
            autoOk
            label=""
            clearable
            format="dd/MM/yyyy"
            value={value}
            onChange={onChange}
         />
      </MuiPickersUtilsProvider>
   );
}

export default BasicDatePicker;
