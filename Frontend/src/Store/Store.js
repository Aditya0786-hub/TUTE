import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../Features/Auth/AuthSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
})