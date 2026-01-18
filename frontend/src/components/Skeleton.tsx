const Skeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] rounded ${className}`}
        />
    );
};

export const HotelCardSkeleton = () => {
    return (
        <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
            <Skeleton className="h-[300px] w-full rounded-none" />
            <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/50 to-transparent">
                <Skeleton className="h-8 w-3/4" />
            </div>
        </div>
    );
};

export const SearchResultSkeleton = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-200 rounded-xl p-6 gap-6 bg-white">
            <Skeleton className="w-full h-[300px] rounded-lg" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-12 w-32 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export const DetailsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-10 w-1/2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px] rounded-md" />
                <Skeleton className="h-[300px] rounded-md" />
                <Skeleton className="h-[300px] rounded-md" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <Skeleton className="h-12 rounded-sm" />
                <Skeleton className="h-12 rounded-sm" />
                <Skeleton className="h-12 rounded-sm" />
                <Skeleton className="h-12 rounded-sm" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-48 rounded-lg" />
            </div>
        </div>
    );
};

export default Skeleton;
