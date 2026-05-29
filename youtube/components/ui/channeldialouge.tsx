"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ChannelData = {
  name?: string;
  description?: string;
};

type ChannelDialougeProps = {
  ifOpen: boolean;
  onClose: () => void;
  channelData?: ChannelData | null;
  mode?: "create" | "edit";
};

const Channeldialouge = ({
  ifOpen,
  onClose,
  channelData,
  mode = "create",
}: ChannelDialougeProps) => {
  const { user: loggedInUser, handlegoglesignin, login } = useUser() as any;
  const router = useRouter();

  // If not logged in, offer login
  if (!loggedInUser && ifOpen) {
    return (
      <Dialog open={ifOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md border border-gray-200 bg-white text-gray-900 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Sign in to create a channel</DialogTitle>
            <DialogDescription>
              You need to sign in with Google first to create your channel.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const signInResult = await handlegoglesignin();
                const authCode = signInResult?.code;
                const authDomain = signInResult?.domain;
                const message = signInResult?.message;

                if (authCode === "auth/unauthorized-domain") {
                  window.alert(
                    `Google sign-in blocked: add ${authDomain || window.location.hostname} to Firebase Authentication -> Settings -> Authorized domains.`,
                  );
                } else if (!signInResult?.ok) {
                  window.alert(
                    `Google sign-in failed: ${message || authCode || "Unknown error"}`,
                  );
                } else {
                  onClose();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign in with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const user = loggedInUser || {
    email: "",
    name: "User",
    image: "https://github.com/shadcn.png",
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (channelData && mode === "edit") {
      setFormData({
        name: channelData.name || "",
        description: channelData.description || "",
      });
      return;
    }

    setFormData({
      name: user.name,
      description: "",
    });
  }, [channelData, mode, user.name]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const userId = (loggedInUser as any)?._id
      ? String((loggedInUser as any)._id)
      : undefined;

    const payload = {
      channelname: formData.name,
      description: formData.description,
    };

    try {
      if (userId) {
        const response = await axiosInstance.patch(
          `/user/update/${userId}`,
          payload,
        );
        login(response?.data);
        toast.success("Channel updated successfully!");
        router.push(`/channel/${userId}`);
        setFormData({
          name: "",
          description: "",
        });
        onClose();
      } else {
        await axiosInstance.post("/user/login", {
          email: user.email || "",
          name: user.name || "User",
          image: user.image || "https://github.com/shadcn.png",
        });
        toast.success("Channel created successfully!");
        onClose();
      }

      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update channel";
      console.error("Channel update error:", error);
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={ifOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border border-gray-200 bg-white text-gray-900 shadow-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create your channel" : "Edit your channel"}
          </DialogTitle>
          <DialogDescription>
            Add channel name and description.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Channel Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Save changes"
                  : "Create channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Channeldialouge;
