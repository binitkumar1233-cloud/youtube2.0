// Force rebuild to clear cached module resolve errors
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/sidebar";
import Categorytabs from "@/components/ui/category-tab";
import { Suspense } from "react";
import VideoGrid from "@/components/ui/videogrid";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Toaster />
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-4 py-6">
          <Categorytabs />
          <div className="w-full mt-6">
            <VideoGrid />
          </div>
          <h1 className="mt-12 flex items-center justify-center gap-3 border-t pt-8 text-center text-4xl font-bold">
            <span>Hello YouTube BINIT</span>
            <span
              className="inline-flex h-10 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-red-500 to-red-700 shadow-[0_6px_16px_rgba(220,38,38,0.45)]"
              aria-label="YouTube style logo"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-white"
                role="img"
                aria-hidden="true"
              >
                <path d="M8 6.5v11l9-5.5-9-5.5z" />
              </svg>
            </span>
          </h1>
        </main>
      </div>
    </div>
  );
}