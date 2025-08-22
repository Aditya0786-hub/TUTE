import React, { useState, useEffect, useRef } from 'react';
import { Upload, UploadCloud, FileVideo, Image, X, Play, Calendar, HardDrive, Eye, CheckCircle, AlertCircle, Video, Folder as FolderVideo, Plus, Trash2, DotSquare, DotIcon, CrossIcon, DeleteIcon, Delete } from 'lucide-react';
import { VideoService } from '../../Features/Video/video.service';
import { useSelector } from 'react-redux';

/**
 * VideoUploadPage Component - Complete video upload platform with drag & drop
 * Features: Video/thumbnail upload, file validation, localStorage persistence, video player
 */
const VideoUploadPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("upload");
  const [videos, setVideos] = useState([]);
  const [currentVideoFile, setCurrentVideoFile] = useState(null);
  const [currentThumbnailFile, setCurrentThumbnailFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [toasts, setToasts] = useState([]);
  const user = useSelector((state) => state.auth.userData);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);//video delte
 const [videoToDelete, setVideoToDelete] = useState(null);//video delete

  // Refs
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // Form submission
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("videoFile", currentVideoFile);
    formData.append("thumbnail", currentThumbnailFile);

    try {
      setIsUploading(true);
      console.log("Uploading...");
      const res = await VideoService.publishVideo(formData);
      console.log(res);
      console.log(res.data.message || "Video uploaded successfully!");
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      console.log(err.response?.data?.message || "Upload failed");
    }
  };

  //Fetching video for library
  const fetchVideos = async (userId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await VideoService.getUserVideos(userId, token);
      return res.data.data.docs;
    } catch (error) {
      console.error(error.response?.data?.message || "Video Fetching Failed");
      return [];
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchVideos(user._id).then((data) => {
      setVideos(data);
    });
  }, [user]);

  //delete Video
  const handleDelete = async()=>{
    try {
      const res = await VideoService.deleteVideos(videoToDelete._id)
      console.log(res)
    } catch (error) {
      console.log("deleted not")
    }
  }

  // Toast notification system
  const showToast = (message, type = "success") => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // File validation functions
  const validateVideoFile = (file) => {
    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/avi",
      "video/quicktime",
    ];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      showToast(
        "Please select a valid video file (MP4, WebM, AVI, MOV)",
        "error"
      );
      return false;
    }

    if (file.size > maxSize) {
      showToast("Video file size must be less than 100MB", "error");
      return false;
    }

    return true;
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove("dragover");
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleVideoFile(files[0]);
    }
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleThumbnailFile(files[0]);
    }
  };

  // File handling functions
  const handleVideoFile = (file) => {
    if (!file || !validateVideoFile(file)) return;
    setCurrentVideoFile(file);
  };

  const handleThumbnailFile = (file) => {
    setCurrentThumbnailFile(file);
  };

  // Remove file handlers
  const removeVideoFile = () => {
    setCurrentVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeThumbnailFile = () => {
    setCurrentThumbnailFile(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Form validation
  const isFormValid = currentVideoFile && videoTitle.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Video className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">VideoHub</h1>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === "upload"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === "library"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FolderVideo className="w-5 h-5" />
                <span>My Videos ({videos.length})</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {activeTab === "upload" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Upload New Video
              </h2>

              <form className="space-y-8">
                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Video File *
                  </label>

                  {!currentVideoFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleVideoDrop}
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <UploadCloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag & drop your video here
                      </p>
                      <p className="text-gray-500 mb-4">or click to browse</p>
                      <p className="text-sm text-gray-400">
                        Supports: MP4, WebM, AVI, MOV
                      </p>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept=".mp4,.webm,.avi,.mov"
                        onChange={(e) => handleVideoFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileVideo className="w-12 h-12 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {currentVideoFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(currentVideoFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeVideoFile}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* {isUploading && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )} */}
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Thumbnail Image (Optional)
                  </label>

                  {!currentThumbnailFile ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleThumbnailDrop}
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium text-gray-700 mb-1">
                        Add thumbnail
                      </p>
                      <p className="text-medium text-gray-400">
                        Drag & Drop Your thumbnail here
                      </p>
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleThumbnailFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={URL.createObjectURL(currentThumbnailFile)}
                            alt="Thumbnail preview"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {currentThumbnailFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(currentThumbnailFile.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeThumbnailFile}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Video Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Enter video title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      maxLength="100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {videoTitle.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Enter video description"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                      maxLength="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {videoDescription.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid || isUploading}
                    onClick={handleUpload}
                    className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isFormValid && !isUploading
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Video</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Library Section */}
        {activeTab === "library" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                My Video Library
              </h2>
              <div className="text-sm text-gray-600">
                {videos.length} video{videos.length !== 1 ? "s" : ""}
              </div>
            </div>

            {videos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FolderVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No videos uploaded yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by uploading your first video
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div
                    key={video?.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                      {video?.thumbnail ? (
                        <img
                          src="http://res.cloudinary.com/dmnrnqzbe/image/upload/v1755800977/ayuqexewqtovd6qk2uxg.jpg"
                          alt={video?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video?.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {video?.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(video?.createdAt)}</span>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent opening video modal
                              setVideoToDelete(video);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200 cursor-pointer hover:-translate-y-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <video
                src={selectedVideo.videoFile}
                controls
                className="w-full rounded-lg mb-4"
                style={{ maxHeight: "60vh" }}
              >
                Your browser does not support the video tag.
              </video>

              {selectedVideo.description && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700">{selectedVideo.description}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Uploaded {formatDate(selectedVideo.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Are you sure you want to delete this video?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setVideoToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
            style={{
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dragover {
          border-color: #3b82f6 !important;
          background-color: #dbeafe !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default VideoUploadPage;