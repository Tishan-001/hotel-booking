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

    const { data: hotelData } = useQuery(['searchHotels', searchParams], () => searchHotels(searchParams))

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
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filter By:</h3>
                    <StarRatingFilter selectedStars={selectedStars} onChange={handleStarsChange} />
                    <TypeFilter selectedTypes={selectedTypes} onChange={handleTypesChange} />
                    <FacilityFilter selectedFacilities={selectedFacilities} onChange={handleFacilitiesChange} />
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)} />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {hotelData?.pagination.total} Hotels Found
                        {search.destination ? ` in ${search.destination}` : ""}
                    </span>
                    <select value={sortOption}
                        onChange={event => setSortOption(event.target.value)}
                        className="p-2 border rounded-md">
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">Price Per Night (Low To Hight)</option>
                        <option value="pricePerNightDesc">Price Per Night (Hight To Low)</option>
                    </select>
                </div>
                {hotelData?.data.map((hotel, index) => (
                    <SearchResultCard key={index} hotel={hotel} />
                ))}
                <div>
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 1}
                        onPageChange={(page) => setPage(page)} />
                </div>
            </div>
        </div>
    )
}

export default Search;