import React, { Suspense } from "react";
import HistoryContent from "@/components/ui/HistoryContent";

const HistoryPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Watch History</h1>
                <Suspense fallback={<div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>}>
                    <HistoryContent />
                </Suspense>
            </div>
        </div>
    );
};

export default HistoryPage;
