import React from 'react';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { roundTextFieldStylesHook } from '@mui-treasury/styles/textField/round';
import { pastelPurple } from '../pastelPurple';

export default function RoundTextField(props) {

    const inputBaseStyles = roundTextFieldStylesHook.useInputBase();
    
    const theme = createMuiTheme({
        palette: {
          primary: {
            main: pastelPurple[500],
          },
        },
    });

    return(
        <ThemeProvider theme={theme}>
            <TextField
                {...props}
                InputProps={{ classes: inputBaseStyles, disableUnderline: true }}
            />
        </ThemeProvider>
    );
}