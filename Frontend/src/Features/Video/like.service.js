import axios from 'axios'

const API_URl = 'http://localhost:7000/api/v2/likes'

export const likeService = {
    getVideoLike : async(videoId)=>{
        const res = await axios.get(`${API_URl}/getVideoLikes/${videoId}`,{
            withCredentials: true
        })
        return res
    },
    toggleLike: async(videoId)=>{
        const res = await axios.post(`${API_URl}/toggleLike`,{videoId},{
            withCredentials: true
        })
        return res
    }
}