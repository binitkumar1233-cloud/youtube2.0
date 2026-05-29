import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";

const RelatedVideos = ({ videos }: { videos: any[] }) => {
  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <RelatedVideoItem key={video._id} video={video} />
      ))}
    </div>
  );
};

function RelatedVideoItem({ video }: { video: any }) {
  const timeAgo = useMemo(
    () => formatDistanceToNow(new Date(video.createdAt), { addSuffix: false }),
    [video.createdAt],
  );

  return (
    <Link
      href={`/watch/${video._id}`}
      className="group flex gap-3 rounded-xl p-2 hover:bg-gray-100 transition-colors"
    >
      <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <video
          src={video.filepath || video.videourl}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          muted
          playsInline
          preload="metadata"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-blue-600 transition-colors">
          {video.videotitle}
        </h3>
        <p className="mt-1 text-xs text-gray-600">{video.videochanel}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {Number(video.views || 0).toLocaleString()} views • {timeAgo} ago
        </p>
      </div>
    </Link>
  );
}

export default RelatedVideos;
