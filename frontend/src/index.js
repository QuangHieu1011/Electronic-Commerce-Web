import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
      <Provider store={store}>  
        <App />
      </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);


reportWebVitals();
