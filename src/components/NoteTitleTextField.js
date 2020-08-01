import React from 'react';
import { InputBase } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles';
import '../index.css';

const NoteTitleTextField = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: 3,
      },
      width: 'auto',
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: '#fff',
      border: '1px solid #a891a0',
      fontSize: 30,
      width: '500px',
      padding: '5px',
      fontFamily: 'Mulish',
      borderColor: '#fff',
      '&:focus': {
        borderColor: '#a891a0',
      },
    },
}))(InputBase);

export default NoteTitleTextField;