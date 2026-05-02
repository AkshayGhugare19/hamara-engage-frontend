import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { AuthProvider } from './context/AuthContext';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
