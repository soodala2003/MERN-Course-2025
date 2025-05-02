import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { ToastContainer } from 'react-toastify';

/* import customFetch from './utils/customFetch';
//import axios from 'axios';

//const resp = await axios.get('/api/v1/test');
const resp = await axios.get('/api/v1/test');
console.log(resp); */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </React.StrictMode>
);

//fetch('http://localhost:5100/api/v1/test');
/* fetch('/api/v1/test')
  .then((res) => res.json())
  .then((data) => console.log(data)); */

/* import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
 */
