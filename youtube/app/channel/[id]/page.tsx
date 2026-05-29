"use client";

import ChannelHeader from "@/components/ui/ChannelHeader";
import Channeltabs from "@/components/ui/Channeltabs";
import VideoUploader from "@/components/ui/VideoUploader";
import ChannelVideo from "@/components/ui/ChannelVideo";
import { useUser } from "@/lib/AuthContext";
import { notFound, useParams } from "next/navigation";

type ChannelShape = {
  channelname: string;
  id: string;
  _id: string;
  name: string;
  NAME: string;
  email: string;
  description: string;
  joinedOn: string;
};

const ChannelData = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const { user } = useUser() as any;

  if (!id) {
    notFound();
  }

  const channelName = user?.name || "Tech Channel";

  let channel: ChannelShape | null = null;

  try {
    channel = {
      id: user?.id || "",
      _id: user?._id || "",
      name: user?.name || "",
      NAME: user?.NAME || user?.name || "",
      email: user?.email || "",
      description: user?.description || "",
      joinedOn: user?.joinedOn || new Date().toISOString(),
      channelname: user?.channelname || user?.name || "Tech Channel",
    };

    if (!channel) {
      notFound();
    }
  } catch {
    notFound();
  }

  const videos: any[] = [
    {
      _id: "1",
      videotitle: "Amazing Nature Documentary",
      filename: "nature-doc.mp4",
      filetype: "video/mp4",
      filepath: "/video.mp4",
      filesize: "500MB",
      videochanel: channel.NAME,
      like: 3000,
      views: 1000000,
      uploader: "Nature_lover",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      videotitle: "Cooking Tutorial: Perfect Pasta",
      filename: "pasta-tutorial.mp4",
      filetype: "video/mp4",
      filepath: "/video.mp4",
      filesize: "500MB",
      videochanel: channel.NAME,
      like: 1000,
      views: 50000,
      uploader: "Chef_master",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return (
    <div>
      <ChannelHeader channel={channel} user={user} />
      <Channeltabs />
      <div className="px-4 pb-8">
        <VideoUploader channelId={id} channelName={channel.channelname} />
      </div>
      <div>
        <ChannelVideo videos={videos} channelId={id} />
      </div>
    </div>
  );
};

export default ChannelData;
