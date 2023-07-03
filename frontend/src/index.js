import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import './index.css';
import './css/home.css'
import './css/login.css'
import './css/register.css'
import './css/bell.css'
import Routes from './Routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Routes />
);