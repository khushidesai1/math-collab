import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SquareButton from './SquareButton';
import '../index.css';
import { pastelDarkPurple, pastelSilver } from '../pastelPurple';
import { Link } from 'react-router-dom';
import MathLogo from '../math-collab.png';

const StyledAppBar = (props) => {
    return(
        <AppBar
        position="fixed"
        elevation={0}
        style={{ backgroundColor: 'white' }}
        >
            <Toolbar style={{ whiteSpace: 'break-spaces' }}>
                <img width={30} height={30} src={MathLogo}></img>
                <span>    </span>
                <Link to='/' style={{ textDecoration: 'none' }}>
                <Typography style={{ fontSize: 17, fontFamily: 'Mulish', fontWeight: 400, color: pastelDarkPurple }}>MathCollab</Typography>
                </Link>
                <span style={{ width: window.innerWidth/1.29 }}>    </span>
                <SquareButton style={{ fontFamily: 'Mulish' }}>Contact Us</SquareButton>
            </Toolbar>
        </AppBar>
    );
}

export default StyledAppBar;