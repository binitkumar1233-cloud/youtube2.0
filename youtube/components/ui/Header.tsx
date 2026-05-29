"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search, VideoIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Channeldialouge from "./channeldialouge";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/AuthContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasChannel] = useState(false);
  const [isdailogeopen, setisdailogeopen] = useState(false);
  const router = useRouter();

  const { user, logout, handlegoglesignin } = useUser();
  const activeUser = user ?? {
    name: "Guest",
    image: "https://github.com/shadcn.png",
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlekeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-1">
            <div className="bg-red-600 p-1 rounded">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M10 15l5-3-5-3v6z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">YouTube</span>
            <span className="text-xs text-gray-500 ml-1">IN</span>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center w-1/2 max-w-xl"
        >
          <input
            id="site-search"
            name="search"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onKeyDown={handlekeydown}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-l-full outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 border border-l-0 rounded-r-full bg-gray-100 hover:bg-gray-200"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <VideoIcon />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell />
          </button>

          {/* Sign in button - prominently visible when not logged in */}
          {!user && (
            <button
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
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium text-sm"
            >
              Sign in
            </button>
          )}

          {/* Dropdown - Only renders after hydration on client */}
          <div className="relative">
            {/* Animated Profile Logo Button */}
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full group focus:outline-none"
              type="button"
            >
              {/* Animated Gradient Pulse Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-300 animate-pulse"></div>

              {/* Avatar Content */}
              <Avatar className="relative w-10 h-10 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={activeUser.image} alt={activeUser.name} />
                <AvatarFallback className="bg-blue-600 text-white font-bold">
                  {activeUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </button>

            {showDropdown && (
              <>
                {/* Overlay to catch clicks outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 40,
                    backgroundColor: "transparent",
                  }}
                />

                {/* Profile dropdown menu */}
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "56px",
                    marginTop: "6px",
                    width: "160px",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    zIndex: 999,
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <div style={{ padding: "8px 0" }}>
                    {!hasChannel && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false);
                          setisdailogeopen(true);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#1f2937",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#eff6ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        Create Channel
                      </button>
                    )}

                    {/* History */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/history");
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#1f2937",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      History
                    </button>

                    {/* Liked videos */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/liked");
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#1f2937",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Liked videos
                    </button>

                    {/* Watch later */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/watch-later");
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#1f2937",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Watch later
                    </button>

                    {/* Sign out */}
                    <button
                      onClick={async () => {
                        try {
                          setShowDropdown(false);
                          if (user) {
                            await logout();
                            router.push("/");
                          } else {
                            const signInResult = await handlegoglesignin();
                            const authCode = signInResult?.code;
                            const authDomain = signInResult?.domain;

                            if (authCode === "auth/unauthorized-domain") {
                              window.alert(
                                `Google sign-in blocked: add ${authDomain || window.location.hostname} to Firebase Authentication -> Settings -> Authorized domains.`,
                              );
                            }
                          }
                        } catch (error) {
                          console.error("Auth action failed", error);
                        }
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#1f2937",
                        backgroundColor: "transparent",
                        border: "none",
                        borderTop: "1px solid #e5e7eb",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {user ? "Sign out" : "Sign in with Google"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Channeldialouge
          ifOpen={isdailogeopen}
          onClose={() => setisdailogeopen(false)}
          channelData={null}
          mode="create"
        />
      </header>
    </>
  );
};

export default Header;
