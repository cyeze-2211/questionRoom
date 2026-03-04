import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@material-tailwind/react';
import { Provider } from 'react-redux'; // Импортируем Provider
import store from './Redux/store.js'; // Подключаем хранилище

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Оборачиваем приложение в Provider */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
