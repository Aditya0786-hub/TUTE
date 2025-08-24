import { ThumbsUp } from 'lucide-react'
import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { VideoService } from '../../Features/Video/video.service.js'

const Comment = () => {

    const [comments,setComment] = useState([])
    const[content,setContent] = useState("")
    
    const {videoId} = useParams()

    const [loading,setLoading] = useState(false)

      const getAllComments = async () => {
        try {
          setLoading(true);
          const res = await VideoService.getAllComments(videoId);
          console.log("Comment Data", res.data.data.docs);
          setComment(res.data.data.docs);
        } catch (error) {
          console.log(error.response?.data?.message || "Comment Not Fetched");
        } finally {
          setLoading(false);
        }
      };

      const addComment = async () => {
        try {
          setLoading(true);
          const res = await VideoService.addComment(videoId, content);
          console.log("Comment Added", res.data);
        //   setContent(""); // clear input after submit
          await getAllComments(); // refresh list
        } catch (error) {
          console.log(
            error.response?.data?.message || "Comment cannot be added"
          );
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (videoId) {
          getAllComments();
        }
      }, [videoId]);

       const formatDate = (dateString) => {
         const date = new Date(dateString);
         return date.toLocaleDateString("en-US", {
           year: "numeric",
           month: "long",
           day: "numeric",
         });
       };
   
   

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md p-4 h-fit">
        <h3 className="text-lg font-semibold mb-3">Comments</h3>

        {/* Comment Box */}
        <div className="mb-4">
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              onClick={addComment}
              className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.length == 0 ? (
            <p>This is your first comment</p>
          ) : (
            comments.map((data) => (
              <div key={data._id}>
                <p className="text-sm">
                  <span className="font-semibold gap-4">{data?.owner.username}</span> 
                 {formatDate(data?.createdAt)}
                </p>
                <p className="text-gray-700 text-sm">
                  {data.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={14} /> 45
                  </span>
                  <span className="cursor-pointer hover:underline">Reply</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment
