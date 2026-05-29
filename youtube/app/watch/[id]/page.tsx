"use client";

import VideoPlayer from "@/components/ui/videopplayer";
import Header from "@/components/ui/Header";
import VideoInfo from "@/components/ui/videoinfo";
import Comments from "@/components/ui/Comments";
import { useParams } from "next/navigation";
import React, { useMemo, useEffect, useState } from "react";
import RelatedVideos from "@/components/ui/RelatedVideos";
import { loadStoredChannelVideos } from "@/lib/video-store";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id;
  const { user } = useUser();
  const [storedVideos, setStoredVideos] = useState([]);
  const [relatedvideos, setRelatedvideos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  

  useEffect(() => {
    setStoredVideos(loadStoredChannelVideos() as any);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setRelatedvideos(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideos();
  }, []);

  const allVideos = useMemo(
    () => [...(relatedvideos as any[]), ...(storedVideos as any[])],
    [relatedvideos, storedVideos],
  );

  const videoId = useMemo(() => {
    const stringid = Array.isArray(id) ? id[0] : id;
    return stringid;
  }, [id]);

  const video = useMemo(() => {
    return allVideos.find((video) => video._id === videoId);
  }, [videoId, allVideos]);

  const handleviews = async () => {
    if (!videoId) return;

    try {
      if (user) {
        return await axiosInstance.post(`/history/${videoId}`, {
          userId: (user as any)?._id || (user as any)?.id,
        });
      } else {
        return await axiosInstance.post(`/history/views/${videoId}`);
      }
    } catch (error) {
      console.log("History save error:", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      handleviews();
    }
  }, [videoId, user]);

  if (!isLoaded) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold">Video not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 py-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Video Segment */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl overflow-hidden shadow-sm">
                  <VideoPlayer video={video} />
                </div>
                <VideoInfo video={video} />
                <Comments videoId={id} />
              </div>

              {/* Up Next / Related Videos */}
              <div className="hidden lg:block space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Up Next</h3>
                <RelatedVideos
                  videos={allVideos.filter((v: any) => v._id !== video._id)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
