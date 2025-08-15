import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    VideoData: [],
    loading: false
}

export const VideoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoData: (state,action) => {
            state.VideoData = action.payload;
            console.log(action.payload)
        },
        setloading: (state,action)=>{
            state.loading = action.payload
            // console.log(action.payload)
        },
    }

})

export const {setVideoData,setloading} = VideoSlice.actions;

export default VideoSlice.reducer;