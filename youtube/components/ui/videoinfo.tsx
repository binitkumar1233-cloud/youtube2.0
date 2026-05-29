import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistance, formatDistanceToNow } from "date-fns";

const VideoInfo = ({ video }: any) => {
  const [like, setLike] = useState(video.likes || 0);
  const [disLiked, setDisLiked] = useState(video.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const { user } = useUser() as any;
  useEffect(() => {
    setLike(video.likes || 0);
    setDisLiked(video.dislikes || 0);
    setIsLiked(false);
    setIsDisLiked(false);
    setShowFullDescription(false);
  }, [video]);
  const handleLike = async () => {
    if (!user) return;
    const userId =
      user?._id || user?.id || user?.uid || user?.userId;
    try {
      // Optimistic UI update
      if (isLiked) {
        setLike((prev: number) => prev - 1);
        setIsLiked(false);
      } else {
        setLike((prev: number) => prev + 1);
        setIsLiked(true);
        if (isDisLiked) {
          setDisLiked((prev: number) => prev - 1);
          setIsDisLiked(false);
        }
      }
      
      // Call backend
      await axiosInstance.post(`/like/${video._id}`, { userId });
    } catch (error) {
      console.error("Error handling like:", error);
      // Revert optimistic update if API fails
      if (isLiked) {
        setLike((prev: number) => prev - 1);
        setIsLiked(false);
      } else {
        setLike((prev: number) => prev + 1);
        setIsLiked(true);
      }
    }
  };
  const handlewatchlater = async () => {
    try {
      const userId = user?._id || user?.id || user?.uid || user?.userId;
      const res = await axiosInstance.post(`/watchlater/${video._id}`, { userId });
      if (res.data.watchlater) {
        setIsWatchLater(true);
      } else {
        setIsWatchLater(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDisLike = async () => {
    if (!user) return;
    const userId = user?._id || user?.id || user?.uid || user?.userId;
    try {
      if (isDisLiked) {
        setDisLiked((prev: number) => prev - 1);
        setIsDisLiked(false);
      } else {
        setDisLiked((prev: number) => prev + 1);
        setIsDisLiked(true);
        if (isLiked) {
          setLike((prev: number) => prev - 1);
          setIsLiked(false);
        }
      }

      await axiosInstance.post(`/dislike/${video._id}`, { userId });
    } catch (error) {
      console.error("Error handling dislike:", error);
      // Revert optimistic update if API fails
      if (isDisLiked) {
        setDisLiked((prev: number) => prev - 1);
        setIsDisLiked(false);
      } else {
        setDisLiked((prev: number) => prev + 1);
        setIsDisLiked(true);
      }
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{video.videotitle}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="fornt-medium">{video.videochanel}</h3>
            <p className="text-sm text-gray-600">1.5M subscribers</p>
          </div>
          <button className="ml-4 bg-red-600 text-white px-4 py-2 rounded-full">
            Subscribe
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 mt-4 sm:mt-0">
          <div className="flex items-center bg-secondary rounded-full">
            <Button
              variant="ghost"
              className={`rounded-l-full px-4 border-r border-background hover:bg-secondary/80 gap-2 ${isLiked ? "text-primary" : ""}`}
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              />
              {like.toLocaleString()}
            </Button>
            <Button
              variant="ghost"
              className={`rounded-r-full px-4 hover:bg-secondary/80 gap-2 ${isDisLiked ? "text-primary" : ""}`}
              onClick={handleDisLike}
            >
              <ThumbsDown
                className={`w-4 h-4 ${isDisLiked ? "fill-current" : ""}`}
              />
              {disLiked.toLocaleString()}
            </Button>
          </div>
          <Button
            variant="ghost"
            className={`bg-gray-100 rounded-full ${isWatchLater ? "text-primary" : ""}`}
            onClick={handlewatchlater}
          >
            <Download className="w-4 h-4" />
            Watch Later
          </Button>
          <Button
            variant="secondary"
            className="rounded-full gap-2 px-4 shadow-sm"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="secondary"
            className="rounded-full gap-2 px-4 shadow-sm hidden sm:flex"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-sm hidden sm:flex px-2"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="bg-secondary rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>
        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
          <p> Hello everyone my name is binit kumar mandal </p>
        </div>
        <Button
          variant="ghost"
          className="mt-2 font-semibold text-sm hover:bg-transparent -ml-2"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
function setIsWatchLater(arg0: boolean) {
  throw new Error("Function not implemented.");
}
