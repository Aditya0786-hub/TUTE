import { createSlice } from '@reduxjs/toolkit'
import { AuthService } from './AuthService';

const initialState = {
    userData: null,
    loading: false
    
}


export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state,action) => {
            state.userData = action.payload;
            console.log(action.payload)
        },
        setLoading: (state,action)=>{
            state.loading = action.payload
            console.log(action.payload)
        },
    }

})

export const { setUserData,setLoading,getCurrentUser } = AuthSlice.actions;

export default AuthSlice.reducer;
