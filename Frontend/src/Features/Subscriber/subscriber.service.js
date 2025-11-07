import axios from "axios";

const API_URl = 'https://tute-w689.onrender.com/api/v2/subscription'

export const SubscriptionService = {
    toggleSubscription: async(username)=> {
        const res = await axios.post(`${API_URl}/channel/${username}`,{},{
            withCredentials: true
        })
        return res
    },
    getSubscribedChannels: async()=> {
        const res = await axios.get(`${API_URl}/getusersubscribedchannel`,{
            withCredentials: true
        })
        return res
    },
}