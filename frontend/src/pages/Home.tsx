import { useQuery } from "react-query"
import { fetchHotels } from "../api-client"
import LatestDestinationCard from "../components/LatestDestinationCard"
import { HotelCardSkeleton } from "../components/Skeleton"

const Home = () => {
    const { data: hotels, isLoading } = useQuery("fetchQuery", () => fetchHotels())

    const topRowHotels = Array.isArray(hotels) ? hotels.slice(0, 2) : []
    const bottomRowHotels = Array.isArray(hotels) ? hotels.slice(2) : []

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Latest Destinations</h2>
                <p className="text-slate-600 mt-1">Most recent destinations added by our hosts</p>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                        <HotelCardSkeleton />
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        {topRowHotels.map(hotel => <LatestDestinationCard key={hotel._id} hotel={hotel} />)}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {bottomRowHotels.map(hotel => (
                            <LatestDestinationCard key={hotel._id} hotel={hotel} />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && hotels?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">No destinations available yet. Check back soon!</p>
                </div>
            )}
        </div>
    )
}

export default Home