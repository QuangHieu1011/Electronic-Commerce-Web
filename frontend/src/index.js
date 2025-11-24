import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Loading from './components/LoadingComponent/Loading';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={<Loading isLoading={true} />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);


reportWebVitals();
