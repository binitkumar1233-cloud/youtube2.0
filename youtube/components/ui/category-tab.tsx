"use client";

import React from "react";
import { Button } from "./button";

const categories = [
    "All",
    "Gaming",
    "Music",
    "Live",
    "Sports",
    "Traval",
    "Science",
    "Technology",
    "Education",
    "Comedy",
    "News",
    "Food",
    "Fashion",
    "Computers",
    "Recent",
    "Watched",
    "New to you",
];

export default function Categorytabs() {
    const [active, setActive] = React.useState("All");

    return (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide max-w-full min-w-0">
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={active === category ? "default" : "secondary"}
                    onClick={() => setActive(category)}
                    className="rounded-lg whitespace-nowrap min-w-fit"
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}