import HistoryContent from "@/components/ui/HistoryContent";
import LikedContent from "@/components/ui/likedContant";
import { Suspense } from "react";
const LikedPage = () => {
    return (
        <main className="flex-1 p-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <LikedContent />
                </Suspense>
            </div>
        </main>
    )
}
 
export default LikedPage;