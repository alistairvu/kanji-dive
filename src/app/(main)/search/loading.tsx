import { SearchBox } from "@/components/search/search-box";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Loading() {
  return (
    <div className="container flex w-full justify-center">
      <div className="lg:w-[66%]">
        <SearchBox disabled />

        <div className="my-4 text-center">
          <Skeleton className="h-16 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
