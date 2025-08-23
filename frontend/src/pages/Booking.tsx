import { useQuery } from "react-query";
import { createPaymentIntent, fetchCurrentUser, fetchHotelById } from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    const { stripePromise } = useAppContext()
    const search = useSearchContext()
    const { hotelId } = useParams()

    const [numberOfNights, setNumberOfNights] = useState<number>(0)

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24)

            setNumberOfNights(Math.ceil(nights))
        }
    }, [search.checkIn, search.checkOut])

    const { data: paymentIntentData } = useQuery("createPaymentIntent", () =>
        createPaymentIntent(hotelId as string, numberOfNights.toString()), {
        enabled: !!hotelId && numberOfNights > 0
    })

    const { data: currentUser } = useQuery("fetchCurrentUser", fetchCurrentUser)
    const { data: hotel } = useQuery('fetchHotelById', () => fetchHotelById(hotelId as string), {
        enabled: !!hotelId
    })

    if (!hotel) {
        return <></>
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                childCount={search.childrenCount}
                adultCount={search.adultCount}
                numberOfNights={numberOfNights}
                hotel={hotel} />
            {
                currentUser && paymentIntentData && (
                    <Elements stripe={stripePromise} options={{ clientSecret: paymentIntentData.clientSecret }}>
                        <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                    </Elements>
                )
            }
        </div >
    )
}

export default Booking