import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchHotelById } from "../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { DetailsSkeleton } from "../components/Skeleton";

const Details = () => {
    const { hotelId } = useParams()
    const { data: hotel, isLoading } = useQuery("fetchHotelById", () => fetchHotelById(hotelId as string), {
        enabled: !!hotelId //+ hotelId = undefined ? false : true
    })

    if (isLoading) {
        return <DetailsSkeleton />;
    }

    if (!hotel) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold text-slate-700">Hotel Not Found</h2>
                <p className="text-slate-500 mt-2">The hotel you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <span className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, index) => (
                        <AiFillStar key={index} className="fill-yellow-400 text-xl" />
                    ))}
                </span>
                <h1 className="text-3xl font-bold text-slate-800 mt-2">{hotel.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {
                    hotel.imageUrls.map((image, index) => (
                        <div className="h-[300px] overflow-hidden rounded-lg" key={index}>
                            <img src={image}
                                alt={`${hotel.name} - Image ${index + 1}`}
                                className="rounded-lg w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))
                }
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3 text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300">
                        {facility}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                <div className="whitespace-pre-line text-slate-700 leading-relaxed">{hotel.description}</div>
                <div className="h-fit sticky top-4">
                    <GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id} />
                </div>
            </div>
        </div >
    )
}

export default Details;