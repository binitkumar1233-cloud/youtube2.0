"use client";

import {
  appendStoredChannelVideo,
  CHANNEL_VIDEOS_UPDATED_EVENT,
} from "@/lib/video-store";
import { Check, FileVideo, Upload, X } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import axiosInstance from "@/lib/axiosinstance";

type VideoUploaderProps = {
  channelId: string;
  channelName: string;
};

const VideoUploader = ({ channelId, channelName }: VideoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [upLoadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [uploadComplete, setUploadComplete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlefilechange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      if (!files[0].type.startsWith("video/")) {
        toast.error("Please upload a valid video file");
        return;
      }
      if (files[0].size > 100 * 1024 * 1024) {
        toast.error("File size exceeds the 100MB limit");
        return;
      }

      setVideoFile(files[0]);
      setUploadComplete(false);
      setUploadProgress(0);

      const filename = files[0].name;
      const extensionIndex = filename.lastIndexOf(".");
      setVideoFileName(
        extensionIndex > 0 ? filename.substring(0, extensionIndex) : filename,
      );
    }
  };

  const resetForm = () => {
    setVideoFileName("");
    setVideoFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelUpload = () => {
    if (isUploading) {
      toast.error("Your Video Upload has been cancelled");
      return;
    }

    setVideoFile(null);
    setVideoFileName("");
    setUploadComplete(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Select a video before uploading");
      return;
    }

    if (!videoFileName.trim()) {
      toast.error("Enter a title for your video");
      return;
    }
    const formdata = new FormData();
    formdata.append("file", videoFile);
    formdata.append("videotitle", videoFileName);
    formdata.append("videochannel", channelName);
    formdata.append("uploader", channelId);
    let savedFilePath = "/video.mp4";
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await axiosInstance.post("/video/upload", formdata, {
        onUploadProgress: (progresevent: any) => {
          const progress = Math.round(
            (progresevent.loaded * 100) / progresevent.total
          );
          setUploadProgress(progress);
        },
      });
      toast.success("Video uploaded successfully");
      savedFilePath =
        res?.data?.filepath || res?.data?.filePath || res?.data?.videoUrl || savedFilePath;
    } catch (error) {
      console.log(error);
      toast.error("Error uploading video");
    }

    setIsUploading(true);
    setUploadComplete(false);

    for (const progressValue of [20, 45, 70, 100]) {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      setUploadProgress(progressValue);
    }

    appendStoredChannelVideo({
      _id: `${Date.now()}`,
      channelId,
      videotitle: videoFileName.trim(),
      filename: videoFile.name,
      filetype: videoFile.type,
      filepath: savedFilePath,
      filesize: `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`,
      videochanel: channelName,
      views: 0,
      uploader: channelName,
      createdAt: new Date().toISOString(),
    });

    window.dispatchEvent(new Event(CHANNEL_VIDEOS_UPDATED_EVENT));
    setIsUploading(false);
    setUploadComplete(true);
    toast.success("Video saved to your channel");
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Upload a Video
      </h2>
      <p className="mt-1 text-sm text-zinc-500">Channel: {channelName}</p>
      <div className="mt-6 space-y-5">
        {!videoFile ? (
          <>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-blue-50"
            >
              <Upload className="mx-auto mb-3 h-10 w-10 text-blue-600" />
              <p className="text-base font-medium text-zinc-900">
                Drag and drop video file to upload
              </p>
              <p className="mt-1 text-sm text-zinc-600">or click to select files</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
                MP4, WebM, MOV or AVI
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                className="hidden"
                onChange={handlefilechange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <FileVideo className="h-5 w-5 text-blue-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{videoFile.name}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {!isUploading && (
                    <button
                      onClick={cancelUpload}
                      className="mt-2 inline-flex items-center rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                  {uploadComplete && (
                    <div className="mt-2 inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      <Check className="mr-1 h-3.5 w-3.5" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-zinc-800">
                  Title
                </Label>
                <Input
                  id="title"
                  value={videoFileName}
                  onChange={(e) => setVideoFileName(e.target.value)}
                  className="h-10 border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  placeholder="Enter video title"
                />
              </div>
            </div>
            {isUploading && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-zinc-700">
                    <span>Uploading...</span>
                    <span>{upLoadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${upLoadProgress}%` }}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={resetForm} variant="outline" className="h-10 px-4">
                Reset
              </Button>
              <Button
                onClick={handleUpload}
                className="h-10 bg-blue-600 px-4 text-white hover:bg-blue-700"
                disabled={isUploading || uploadComplete}
              >
                {uploadComplete ? "Uploaded" : isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
