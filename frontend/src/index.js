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
import { LanguageProvider } from './context/LanguageContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Provider store={store}>
          <PersistGate loading={<Loading isLoading={true} />} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </LanguageProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);


reportWebVitals();
