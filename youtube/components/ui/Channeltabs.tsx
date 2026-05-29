"use client";

import React, { useState } from "react";
const tabs = [
    {id: "home", label: "Home"},
    {id: "videos", label: "Videos"},
    {id: "playlists", label: "Playlists"},
    {id: "community", label: "Community"},
    {id: "about", label: "About"},
];
const Channeltabs = () => {
    const [activetab, setActiveTab] = useState("videos");
    return (
        <div className="border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex gap-1 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                                activetab === tab.id
                                    ? "text-zinc-950"
                                    : "text-zinc-500 hover:text-zinc-800"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            {activetab === tab.id && (
                                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-zinc-900" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Channeltabs;