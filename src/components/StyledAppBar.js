import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SquareButton from './SquareButton';
import '../index.css';
import { pastelDarkPurple, pastelSilver } from '../pastelPurple';
import { Link } from 'react-router-dom';

const StyledAppBar = (props) => {
    return(
        <AppBar
        position="fixed"
        elevation={0}
        style={{ backgroundColor: 'white' }}
        >
            <Toolbar>
                <Link to='/' style={{ textDecoration: 'none' }}>
                <Typography style={{ fontSize: 17, fontFamily: 'Mulish', fontWeight: 400, color: pastelDarkPurple }}>MathCollab</Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
}

export default StyledAppBar;