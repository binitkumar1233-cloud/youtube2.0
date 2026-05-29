"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

interface HistoryVideo {
  _id: string;
  videotitle: string;
  videochannel: string;
  channelAvatar: string;
  views: number;
  createdAt: string;
}

interface HistoryItem {
  _id: string;
  videoid: HistoryVideo;
  viewer: string;
  watchedon: string;
}

const HistoryContent = () => {
  const { user } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userId = (user as any)?._id || (user as any)?.id;
      const response = await axiosInstance.get(`/history/${userId}`);
      setHistory(response.data || []);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Loading...</p>
      </div>
    );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center text-muted-foreground">
        <Clock className="w-12 h-12" />
        <h2 className="text-lg font-semibold text-foreground">
          Keep track of what you watch
        </h2>
        <p className="text-sm">
          Watch history isn&apos;t viewable when signed out.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center text-muted-foreground">
        <Clock className="w-12 h-12" />
        <h2 className="text-lg font-semibold text-foreground">
          No watch history yet
        </h2>
        <p className="text-sm">Videos you watch will appear here</p>
      </div>
    );
  }

  const handleRemoveHistory = async (historyId: string) => {
    try {
      console.log("Removing history item with ID:", historyId);
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item._id !== historyId),
      );
    } catch (error) {
      console.error("Error removing history item:", error);
    }
  };

  const videoSrc = "/video.mp4";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{history.length} videos</p>

      <div className="space-y-4">
        {history.map((item) => {
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
                    {formatDistanceToNow(new Date(item.watchedon), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Watched on {new Date(item.watchedon).toLocaleDateString()}
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
                  <DropdownMenuItem
                    onClick={() => handleRemoveHistory(item._id)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove from history
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

export default HistoryContent;
