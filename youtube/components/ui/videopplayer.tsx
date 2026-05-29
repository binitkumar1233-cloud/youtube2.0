import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

function buildVideoUrl(filepath: string) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:5000";

  if (!filepath) {
    return "/video.mp4";
  }

  const normalizedPath = filepath.trim();

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (
    normalizedPath.startsWith("/upload") ||
    normalizedPath.startsWith("uploads/") ||
    normalizedPath.startsWith("upload/")
  ) {
    return `${backendUrl}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
  }

  if (normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  return `/${normalizedPath}`;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = video?.filepath ? buildVideoUrl(video.filepath) : "/video.mp4";

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        preload="metadata"
        poster={`/placeholder.svg?height=480&width=854`}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
