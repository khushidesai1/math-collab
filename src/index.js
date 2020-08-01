import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import './fonts/Mulish-Black.ttf';
import './fonts/Mulish-BlackItalic.ttf';
import './fonts/Mulish-Bold.ttf';
import './fonts/Mulish-BoldItalic.ttf';
import './fonts/Mulish-ExtraBold.ttf';
import './fonts/Mulish-ExtraBoldItalic.ttf';
import './fonts/Mulish-ExtraLight.ttf';
import './fonts/Mulish-ExtraLightItalic.ttf';
import './fonts/Mulish-Italic.ttf';
import './fonts/Mulish-Light.ttf';
import './fonts/Mulish-LightItalic.ttf';
import './fonts/Mulish-Medium.ttf';
import './fonts/Mulish-MediumItalic.ttf';
import './fonts/Mulish-Regular.ttf';
import './fonts/Mulish-SemiBold.ttf';
import './fonts/Mulish-SemiBoldItalic.ttf';
Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
