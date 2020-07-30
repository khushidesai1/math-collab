import React from 'react';
import './App.css';
import { Auth } from 'aws-amplify';

const Login = (props) => {
    return (
        <div>
            <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
        </div>
    )
}

export default Login;