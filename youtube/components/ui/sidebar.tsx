"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Compass,
  SubscriptIcon,
  History,
  ThumbsUp,
  Clock,
  User,
} from "lucide-react";
import Channeldialouge from "./channeldialouge";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
  const menuItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Subscriptions", icon: SubscriptIcon, href: "/subscriptions" },
    { label: "History", icon: History, href: "/history" },
    { label: "Liked videos", icon: ThumbsUp, href: "/liked" },
    { label: "Watch later", icon: Clock, href: "/watch-later" },
  ];
  const {user} = useUser();

  const [isdailogeopen, setisdailogeopen] = useState(false);

  return (
    <aside className="w-64 bg-gray-900 text-white h-full overflow-y-auto p-4 shrink-0">
      <nav className="space-y-2">
        {menuItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-800"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}

        {user ? (
          <Link
            href={`/channel/1`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-800"
          >
            <User className="h-4 w-4" />
            <span>Your channel</span>
          </Link>
        ) : (
          <div className="px-2 py-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setisdailogeopen(true)}
            >
              Create Channel
            </Button>
          </div>
        )}
      </nav>
       <Channeldialouge
          ifOpen={isdailogeopen}
          onClose={() => setisdailogeopen(false)}
          channelData={null}
          mode="create"
        />

    </aside>
  );
};

export default Sidebar;