"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type SearchVideo = {
    _id: string;
    videotitle: string;
    filename: string;
    filetype: string;
    filepath: string;
    thumbnail: string;
    videochannel: string;
    like: number;
    views: number;
    uploader: string;
    createdAt: string;
};

type SearchResultProps = {
    query: string;
};

const SearchResult = ({ query }: SearchResultProps) => {
    const [videos, setVideos] = useState<SearchVideo[]>([]);

    useEffect(() => {
        const allVideos: SearchVideo[] = [
            {
                _id: "1",
                videotitle: "Amazing Nature Documentary",
                filename: "nature-doc.mp4",
                filetype: "video/mp4",
                filepath: "/video.mp4",
                thumbnail:
                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
                videochannel: "Nature Channel",
                like: 1250,
                views: 45000,
                uploader: "nature_lover",
                createdAt: new Date().toISOString(),
            },
            {
                _id: "2",
                videotitle: "Cooking Tutorial: Perfect Pasta",
                filename: "pasta-tutorial.mp4",
                filetype: "video/mp4",
                filepath: "/video.mp4",
                thumbnail:
                    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
                videochannel: "Chef's Kitchen",
                like: 1000,
                views: 50000,
                uploader: "chef_master",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
        ];

        const searchTerm = query.trim().toLowerCase();
        const results = allVideos.filter(
            (vid) =>
                vid.videotitle.toLowerCase().includes(searchTerm) ||
                vid.videochannel.toLowerCase().includes(searchTerm)
        );

        setVideos(results);
    }, [query]);

    if (!query.trim()) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-8 text-center">
                <p className="text-sm text-gray-600">Enter a search term to find videos.</p>
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">No results found</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Try different keywords or remove search filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
                <Link
                    key={video._id}
                    href={`/watch/${video._id}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                        <img
                            src={video.thumbnail}
                            alt={video.videotitle}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=80";
                            }}
                        />
                        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs text-white">
                            Preview
                        </span>
                    </div>
                    <div className="space-y-2 p-4">
                        <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {video.videotitle}
                        </h2>
                        <p className="text-sm text-gray-600">{video.videochannel}</p>
                        <p className="text-xs text-gray-500">
                            {video.views.toLocaleString()} views •{" "}
                            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchResult;