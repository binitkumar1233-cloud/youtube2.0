"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
const ChannelHeader = ({ channel,user }: any) => {
    const [issubscribe,setIssubscribe] = useState(false);
    const channelName = channel?.name || channel?.NAME || "Channel";
    const handle = channelName.toLowerCase().replace(/\s+/g, "");

    return (
        <div className="w-full rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="relative h-36 md:h-48 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500" />

            <div className="px-4 md:px-6 pb-5">
                <div className="-mt-12 md:-mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-end gap-4">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md bg-white">
                            <AvatarImage src={user?.image} alt={`${channelName} avatar`} />
                            <AvatarFallback className="text-2xl font-semibold bg-neutral-100 text-neutral-700">
                                {channelName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="pb-1">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900">{channelName}</h1>
                            <span className="text-sm md:text-base text-neutral-600">@{handle}</span>
                        </div>
                    </div>

                    {user && user.id === channel.id && (
                        <button
                            onClick={() => setIssubscribe(!issubscribe)}
                            className="h-10 px-5 rounded-full text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800"
                        >
                            {issubscribe ? "Unsubscribe" : "Subscribe"}
                        </button>
                    )}
                </div>

                {channel?.description && (
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-700 max-w-3xl">
                        {channel.description}
                    </p>
                )}
            </div>
        </div>
    )
}

export default ChannelHeader;