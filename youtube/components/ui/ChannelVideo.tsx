"use client";

import {
    CHANNEL_VIDEOS_UPDATED_EVENT,
    loadStoredChannelVideos,
} from "@/lib/video-store";
import React, { useEffect, useState } from "react";
import Videocard from "./videocard";

type ChannelVideoProps = {
    videos?: any[];
    channelId?: string;
};

const ChannelVideo = ({ videos = [], channelId }: ChannelVideoProps) => {
    const [channelVideos, setChannelVideos] = useState<any[]>(videos);

    useEffect(() => {
        const syncVideos = () => {
            const storedVideos = loadStoredChannelVideos().filter((video) =>
                channelId ? video.channelId === channelId : true,
            );

            const mergedVideos = [...storedVideos, ...videos].reduce<any[]>((list, video) => {
                if (list.some((item) => item._id === video._id)) {
                    return list;
                }

                list.push(video);
                return list;
            }, []);

            setChannelVideos(mergedVideos);
        };

        syncVideos();
        window.addEventListener("storage", syncVideos);
        window.addEventListener(CHANNEL_VIDEOS_UPDATED_EVENT, syncVideos);

        return () => {
            window.removeEventListener("storage", syncVideos);
            window.removeEventListener(CHANNEL_VIDEOS_UPDATED_EVENT, syncVideos);
        };
    }, [channelId, videos]);

    if (channelVideos.length === 0) {
        return (
            <div>
                <p>No videos uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">Videos</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {channelVideos.map((video: any) => (
                    <div key={video._id ?? video.id} className="w-full max-w-[320px]">
                        <Videocard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChannelVideo;