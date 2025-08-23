import { createContext, useContext, useState } from "react"

type SearchContext = {
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childrenCount: number,
    hotelId: string,
    saveSearchValues: (destination: string, checkIn: Date, checkOut: Date, adultCount: number, childrenCount: number) => void,
}

interface SearchContextProviderProps {
    children: React.ReactNode
}

const SearchContext = createContext<SearchContext | undefined>(undefined)

export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {
    const [destination, setDestination] = useState<string>(sessionStorage.getItem('destination' || ''))
    const [checkIn, setCheckIn] = useState<Date>(() => new Date(sessionStorage.getItem('checkIn') || new Date().toISOString()))
    const [checkOut, setCheckOut] = useState<Date>(() => new Date(sessionStorage.getItem('checkOut') || new Date().toISOString()))
    const [adultCount, setAdultCount] = useState<number>(() => parseInt(sessionStorage.getItem('adultCount') || "1"))
    const [childrenCount, setChildrenCount] = useState<number>(() => parseInt(sessionStorage.getItem('childCount') || "1"))
    const [hotelId, setHotelId] = useState<string>(() => sessionStorage.getItem('hotelId') || "")

    const saveSearchValues = (destination: string, checkIn: Date, checkOut: Date, adultCount: number, childrenCount: number, hotelId?: string) => {
        setDestination(destination)
        setCheckIn(checkIn)
        setCheckOut(checkOut)
        setAdultCount(adultCount)
        setChildrenCount(childrenCount)

        if (hotelId) {
            setHotelId(hotelId)
            sessionStorage.setItem('hotelId', hotelId.toString())
        }

        sessionStorage.setItem('destination', destination)
        sessionStorage.setItem('checkIn', checkIn.toISOString())
        sessionStorage.setItem('checkOut', checkOut.toISOString())
        sessionStorage.setItem('adultCount', adultCount.toString())
        sessionStorage.setItem('childCount', childrenCount.toString())



    }

    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childrenCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    return context as SearchContext
}