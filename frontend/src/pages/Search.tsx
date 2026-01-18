import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import { searchHotels } from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import TypeFilter from "../components/TypeFilter";
import FacilityFilter from "../components/FacilityFilter";
import PriceFilter from "../components/PriceFilter";
import { SearchResultSkeleton } from "../components/Skeleton";

const Search = () => {
    const search = useSearchContext()
    const [page, setPage] = useState<number>(1)
    const [selectedStars, setSelectedStars] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>()
    const [sortOption, setSortOption] = useState<string>("")

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childrenCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption
    }

    const { data: hotelData, isLoading } = useQuery(['searchHotels', searchParams], () => searchHotels(searchParams))

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value

        setSelectedStars(preStars =>
            event.target.checked ?
                [...preStars, starRating] :
                preStars.filter(star => star !== starRating))
    }

    const handleTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newType = event.target.value

        setSelectedTypes(preTypes =>
            event.target.checked ?
                [...preTypes, newType] :
                preTypes.filter(type => type !== newType))
    }

    const handleFacilitiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFacility = event.target.value

        setSelectedFacilities(preFacilities =>
            event.target.checked ?
                [...preFacilities, newFacility] :
                preFacilities.filter(facility => facility !== newFacility))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 animate-fade-in">
            {/* Filters Sidebar */}
            <div className="rounded-xl border border-slate-200 p-5 h-fit sticky top-10 bg-white shadow-sm">
                <div className="space-y-5">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-4">Filter By</h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
                    <TypeFilter selectedTypes={selectedTypes} onChange={handleTypesChange} />
                    <FacilityFilter selectedFacilities={selectedFacilities} onChange={handleFacilitiesChange} />
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)} />
                </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
                    <span className="text-xl font-bold text-slate-800">
                        {isLoading ? (
                            <span className="animate-pulse">Searching...</span>
                        ) : (
                            <>
                                {hotelData?.pagination.total || 0} Hotels Found
                                {search.destination && <span className="text-blue-600"> in {search.destination}</span>}
                            </>
                        )}
                    </span>
                    <select
                        value={sortOption}
                        onChange={event => setSortOption(event.target.value)}
                        className="p-2 border border-slate-200 rounded-lg bg-white hover:border-blue-400 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (Low To High)</option>
                        <option value="pricePerNightDesc">Price Per Night (High To Low)</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-5">
                        <SearchResultSkeleton />
                        <SearchResultSkeleton />
                        <SearchResultSkeleton />
                    </div>
                ) : hotelData?.data.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-lg">No hotels found matching your criteria.</p>
                        <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    hotelData?.data.map((hotel, index) => (
                        <SearchResultCard key={hotel._id || index} hotel={hotel} />
                    ))
                )}

                {!isLoading && hotelData && hotelData.data.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            page={hotelData?.pagination.page || 1}
                            pages={hotelData?.pagination.pages || 1}
                            onPageChange={(page) => setPage(page)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search;