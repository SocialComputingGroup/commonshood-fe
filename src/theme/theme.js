/* App Custom Theme */

import { createMuiTheme } from "@material-ui/core/styles";
//Import some colors

import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#0b6258"
        },
        secondary: {
            main: "#e65100"
        },
        info: {
            main: "#1565c0"
        },
        success: {
            main: green[700]
        },
        warning: {
            main: amber[700]
        },
        type: "light"
    }
});

export default theme;
