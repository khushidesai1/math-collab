import React from 'react';
import { Button } from '@material-ui/core';
import { useTwitterBtnStyles } from '@mui-treasury/styles/button/twitter';
import { pastelPurple } from '../pastelPurple';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: pastelPurple[500],
        }
    }
})

const SquareButton = (props) => {    
    
    const buttonStyles = useTwitterBtnStyles();
    
    return(
        <ThemeProvider theme={theme}>
            <Button
            {...props}
            classes={buttonStyles}
            variant='outlined'
            color='primary'
            size='large'
            />
        </ThemeProvider>
    );
}

export default SquareButton;