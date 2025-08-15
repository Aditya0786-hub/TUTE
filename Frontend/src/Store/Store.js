import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../Features/Auth/AuthSlice'
import videoReducer from '../Features/Video/video.slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer
    },
})