"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, MoreVertical,  Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LikedVideo {
  _id: string;
  videotitle: string;
  videochannel?: string;
  videochanel?: string;
  channelAvatar: string;
  views: number;
  createdAt: string;
}

interface LikedItem {
  _id: string;
  videoid: LikedVideo;
  viewer: string;
  likedon: string;
}

const LikedContent = () => {
  const { user } = useUser();
  const [liked, setLiked] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLiked();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadLiked = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userId =
        (user as any)?._id ||
        (user as any)?.id ||
        (user as any)?.uid ||
        (user as any)?.userId;
      if (!userId) {
        setLiked([]);
        return;
      }
      const response = await axiosInstance.get(`/like/${userId}`);
      setLiked(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading liked videos:", error);
      setLiked([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-start justify-start h-48 text-muted-foreground">
        <p>Loading...</p>
      </div>
    );

  if (!user) {
    return (
      <div className="flex flex-col items-start justify-start h-64 gap-3 text-left text-muted-foreground">
        <Clock className="w-12 h-12" />
        <h2 className="text-lg font-semibold text-foreground">
          Keep track of videos you like
        </h2>
        <p className="text-sm">
          Liked videos aren&apos;t viewable when signed out.
        </p>
        <Button><Play> Play All</Play></Button>
      </div>
    );
  }

  if (liked.length === 0) {
    return (
      <div className="flex flex-col items-start justify-start h-64 gap-3 text-left text-muted-foreground">
        <Clock className="w-12 h-12" />
        <h2 className="text-lg font-semibold text-foreground">
          No liked videos yet
        </h2>
        <p className="text-sm">Videos you like will appear here</p>
      </div>
    );
  }

  const handleRemoveLiked = async (likedId: string) => {
    try {
      console.log("Removing liked item with ID:", likedId);
      setLiked((prevLiked) => prevLiked.filter((item) => item._id !== likedId));
    } catch (error) {
      console.error("Error removing liked item:", error);
    }
  };

  const videoSrc = "/video.mp4";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{liked.length} videos</p>

      <div className="space-y-4">
        {liked.map((item) => {
          const video = item.videoid;
          const channelName = video.videochannel || video.videochanel || "Unknown channel";
          const likedDate = new Date(item.likedon || "");
          return (
            <div
              key={item._id}
              className="flex items-start gap-4 group rounded-xl p-2 hover:bg-muted/50 transition-colors"
            >
              <Link href={`/watch/${video._id}`} className="shrink-0">
                <div className="relative w-44 h-24 rounded-xl overflow-hidden bg-muted">
                  <video
                    src={videoSrc}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    preload="metadata"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0 py-1">
                <Link
                  href={`/watch/${video._id}`}
                  className="block space-y-1"
                >
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                    {video.videotitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={video.channelAvatar}
                      alt={channelName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <p className="text-xs text-muted-foreground">
                      {channelName}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {video.views.toLocaleString()} views &middot;{" "}
                    {formatDistanceToNow(likedDate, {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Liked on {likedDate.toLocaleDateString()}
                  </p>
                </Link>
              </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRemoveLiked(item._id)}>
                  <X className="mr-2 h-4 w-4" />
                  Remove from liked videos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default LikedContent;
