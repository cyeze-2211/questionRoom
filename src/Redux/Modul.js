import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
        moduleId: 0, // Новый параметр для moduleId
    },
    reducers: {
        increment(state) {
            state.value += 1;
        },
        incrementModule(state) {
            state.moduleId += 1; // Увеличение moduleId
        },
    },
});

export const { increment, incrementModule } = counterSlice.actions;

export default counterSlice.reducer;
