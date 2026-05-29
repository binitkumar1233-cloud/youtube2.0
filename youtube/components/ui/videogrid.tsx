import React from 'react';
import Videocard from './videocard';

const VideoGrid = () => {
    const videos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary",
            filename: "nature-doc.mp4",
            filetype: "video/mp4",
            filepath: "/video.mp4",
            filesize: "500MB",
            videochanel: "Nature Channel",
            like: 3000,
            views: "1M",
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
            videochanel: "Chef's Kitchen",
            like: 1000,
            views: "50k",
            uploader: "Chef_master",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
            {videos.map((video) => (
                <Videocard key={video._id} video={video} />
            ))}
        </div>
    );
};
export default VideoGrid;