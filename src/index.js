import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './assets/css/simplebar.css';
import './assets/css/light.css';

import './assets/css/md_style.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
	<BrowserRouter>
	<App />
	</BrowserRouter>
  </>  
);


