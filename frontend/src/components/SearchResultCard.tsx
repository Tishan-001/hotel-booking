import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../types/types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

type Props = {
    hotel: HotelType;
};

const SearchResultCard = ({ hotel }: Props) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-200 rounded-xl p-6 gap-6 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="w-full h-[300px] overflow-hidden rounded-lg">
                <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex">
                            {
                                Array.from({ length: hotel.starRating }).map((_, index) => (
                                    <AiFillStar key={index} className="fill-yellow-400" />
                                ))
                            }
                        </span>
                        <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{hotel.type}</span>
                    </div>
                    <Link to={`/detail/${hotel._id}`} className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors duration-300">{hotel.name}</Link>

                    <div className="flex items-center gap-1 text-slate-500 mt-2">
                        <MdLocationOn className="text-blue-600" />
                        <span className="text-sm">{hotel.city}, {hotel.country}</span>
                    </div>
                </div>

                <div className="line-clamp-3 text-slate-600 mt-4">
                    {hotel.description}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {hotel.facilities.slice(0, 4).map((facility, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {facility}
                        </span>
                    ))}
                    {hotel.facilities.length > 4 && (
                        <span className="text-sm text-slate-500">+{hotel.facilities.length - 4} more</span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                        <span className="text-2xl font-bold text-slate-800">${hotel.pricePerNight}</span>
                        <span className="text-slate-500 text-sm"> / night</span>
                    </div>
                    <Link
                        to={`/detail/${hotel._id}`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-md transition-all duration-300"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SearchResultCard;