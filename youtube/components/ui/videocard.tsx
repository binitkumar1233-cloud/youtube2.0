import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Videocard({ video }: any) {
  return (
    <Link href={`/watch/${video._id}`} className="group block h-full w-full">
      <div className="space-y-3 cursor-pointer h-full">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted group-hover:rounded-none transition-all duration-300">
          <video
            src={video.filepath}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
            muted
            autoPlay
            loop
            playsInline
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            10:30
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src="/placeholder.svg?height=36&width=36" />
            <AvatarFallback>{video.videochanel?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {video.videotitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{video.videochanel}</p>
            <p suppressHydrationWarning className="text-sm text-gray-600">
              {video.views.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
