// components/skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-[160px] rounded-md" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}
