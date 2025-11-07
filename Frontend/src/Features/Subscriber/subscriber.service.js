import axios from "axios";

const API_URl = 'http://localhost:7000/api/v2/subscription'

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