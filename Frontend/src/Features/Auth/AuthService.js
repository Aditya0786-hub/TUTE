import axios from 'axios'

const API_URl = 'https://tute-w689.onrender.com/api/v2/users'

export const AuthService = {
    register: async (Data) => {
        const response = await axios.post(`${API_URl}/register`,Data,{
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response
    },
    login: async (Data) => {
         const response = await axios.post(`${API_URl}/login`,Data,{
            withCredentials: true
         })
        return response
    },
    getCurrentUser: async() => {
        const response = await axios.get(`${API_URl}/getcurrentuser`,{
            withCredentials: true
         }) 
         return response
    },
    logout: async() => {
         await axios.post(`${API_URl}/logout`,{},{
            withCredentials: true
         }) 
    },
    getUserChannelProfile: async(username)=>{
        console.log(username)
        const res = await axios.get(`${API_URl}/channel/${username}`,{
            withCredentials: true
         })
         return res
    }
    
    
    
}