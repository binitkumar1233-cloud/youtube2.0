"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, MoreVertical, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

interface WatchLaterVideo {
  _id: string;
  videotitle: string;
  videochannel: string;
  channelAvatar: string;
  views: number;
  createdAt: string;
}

interface WatchLaterItem {
  _id: string;
  videoid: WatchLaterVideo;
  viewer: string;
  watchlateron: string;
}

const WatchLaterContent = () => {
  const { user } = useUser();
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWatchLater();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWatchLater = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userId = (user as any)?._id || (user as any)?.id;
      const response = await axiosInstance.get(`/watchlater/${userId}`);
      setWatchLater(response.data || []);
    } catch (error) {
      console.error("Error loading watch later videos:", error);
      setWatchLater([]);
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
          Watch later videos aren&apos;t viewable when signed out.
        </p>
        <Button><Play> Play All</Play></Button>
      </div>
    );
  }

  if (watchLater.length === 0) {
    return (
      <div className="flex flex-col items-start justify-start h-64 gap-3 text-left text-muted-foreground">
        <Clock className="w-12 h-12" />
        <h2 className="text-lg font-semibold text-foreground">
          No watch later videos yet
        </h2>
        <p className="text-sm">Videos you add to watch later will appear here</p>
      </div>
    );
  }

  const handleRemoveWatchLater = async (watchLaterId: string) => {
    try {
      console.log("Removing watch later item with ID:", watchLaterId);
      setWatchLater((prevWatchLater) => prevWatchLater.filter((item) => item._id !== watchLaterId));
    } catch (error) {
      console.error("Error removing watch later item:", error);
    }
  };

  const videoSrc = "/video.mp4";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{watchLater.length} videos</p>

      <div className="space-y-4">
        {watchLater.map((item) => {
          const video = item.videoid;
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
                <Link href={`/watch/${video._id}`} className="block space-y-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                    {video.videotitle}
                  </h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={video.channelAvatar}
                      alt={video.videochannel}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <p className="text-xs text-muted-foreground">
                      {video.videochannel}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {video.views.toLocaleString()} views &middot;{" "}
                    {formatDistanceToNow(new Date(item.watchlateron), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added on {new Date(item.watchlateron).toLocaleDateString()}
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
                  <DropdownMenuItem onClick={() => handleRemoveWatchLater(item._id)}>
                    <X className="mr-2 h-4 w-4" />
                    Remove from watch later
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

export default WatchLaterContent;
