import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Modul';

const store = configureStore({
    reducer: {
        counter: counterReducer, // Добавляем наш счётчик
    },
});

export default store;
