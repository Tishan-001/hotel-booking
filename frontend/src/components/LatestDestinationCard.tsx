import { Link } from "react-router-dom"
import { HotelType } from "../types/types"

type Props = {
    hotel: HotelType
}

const LatestDestinationCard = ({ hotel }: Props) => {
    return (
        <Link
            to={`/detail/${hotel._id}`}
            className="relative cursor-pointer overflow-hidden rounded-xl group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
            <div className="h-[300px] overflow-hidden">
                <img
                    src={hotel.imageUrls[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

            <div className="absolute bottom-0 p-4 w-full">
                <span className="text-white font-bold tracking-tight text-2xl drop-shadow-lg">
                    {hotel.name}
                </span>
                <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to view details →
                </p>
            </div>
        </Link>
    )
}

export default LatestDestinationCard