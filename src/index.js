import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux/es/exports';
import { Web3ReactProvider } from "@web3-react/core";
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import store from './store/store';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </Web3ReactProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
