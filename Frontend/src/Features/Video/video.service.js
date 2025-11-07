import axios from 'axios'

const API_URl = 'http://localhost:7000/api/v2/video'
const API_URl2 = 'http://localhost:7000/api/v2/comments'


export const VideoService =  {
    publishVideo : async(data)=> {
        const res = await axios.post(`${API_URl}/publishvideo`,data,{
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
        return res
    },
    getAllVideos : async()=> {
        const res =  await axios.get(`${API_URl}/getallvideos`,{
            withCredentials: true
        })
        return res
    },
    getUserVideos : async(userId,token)=> {
        console.log(userId)
        const res = await axios.get(
          `${API_URl}/getallvideos`,
          {
            params: {
              userId: userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          {
            withCredentials: true,
          }
        );
        return res
    },
    getVideosById: async(videoId)=>{
        const res = await axios.get(`${API_URl}/${videoId}`,{
            withCredentials: true
        })
        return res;
    },
    deleteVideos: async(videoId)=>{
      const res = await axios.delete(`${API_URl}/deleteVideo/${videoId}`,{
        withCredentials: true
      })
      return res;
    },
    addComment: async(videoId,content)=>{
      const res = await axios.post(`${API_URl2}/${videoId}`,{
        content: content
      },
        {
            withCredentials: true
        })
        return res
    },
    getAllComments: async(videoId)=>{
      const res = await axios.get(`${API_URl2}/${videoId}`,
        {
            withCredentials: true
        })
        return res
    },
    addViews: async(videoId)=>{
      const res = await axios.patch(`${API_URl}/addview/${videoId}`,{},{
            withCredentials: true
        }
      )
      return res;
    }
    

    
}