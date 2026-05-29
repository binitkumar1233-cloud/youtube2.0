export const CHANNEL_VIDEOS_STORAGE_KEY = "youtube-channel-videos";
export const CHANNEL_VIDEOS_UPDATED_EVENT = "youtube-channel-videos-updated";

export type StoredChannelVideo = {
  _id: string;
  channelId: string;
  videotitle: string;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: string;
  videochanel: string;
  views: number;
  uploader: string;
  createdAt: string;
};

export function loadStoredChannelVideos(): StoredChannelVideo[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawVideos = window.localStorage.getItem(CHANNEL_VIDEOS_STORAGE_KEY);
    if (!rawVideos) {
      return [];
    }

    const parsedVideos = JSON.parse(rawVideos);
    return Array.isArray(parsedVideos) ? parsedVideos : [];
  } catch {
    return [];
  }
}

export function saveStoredChannelVideos(videos: StoredChannelVideo[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHANNEL_VIDEOS_STORAGE_KEY, JSON.stringify(videos));
}

export function appendStoredChannelVideo(video: StoredChannelVideo) {
  const existingVideos = loadStoredChannelVideos();
  saveStoredChannelVideos([video, ...existingVideos]);
}