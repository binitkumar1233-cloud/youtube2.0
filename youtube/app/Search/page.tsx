import SearchResult from "@/components/ui/SearchResult";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const q = params.q;
  const query = Array.isArray(q) ? q[0] : (q ?? "");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-5">
        {query && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Search results for "{query}"
            </h1>
          </div>
        )}
        <Suspense fallback={<div>Loading search resuits...</div>}>
          <SearchResult query={query} />
        </Suspense>
      </div>
    </div>
  );
};

export default SearchPage;
