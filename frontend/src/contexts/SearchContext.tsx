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
    const [destination, setDestination] = useState<string>(() => {
        const saved = sessionStorage.getItem('destination');
        return saved ? saved : "";
    });
    
    const [checkIn, setCheckIn] = useState<Date>(() => {
        const saved = sessionStorage.getItem('checkIn');
        return saved ? new Date(saved) : new Date();
    });
    
    const [checkOut, setCheckOut] = useState<Date>(() => {
        const saved = sessionStorage.getItem('checkOut');
        return saved ? new Date(saved) : new Date();
    });
    
    const [adultCount, setAdultCount] = useState<number>(() => {
        const saved = sessionStorage.getItem('adultCount');
        return saved ? parseInt(saved) : 1;
    });
    
    const [childrenCount, setChildrenCount] = useState<number>(() => {
        const saved = sessionStorage.getItem('childCount');
        return saved ? parseInt(saved) : 0;
    });
    
    const [hotelId, setHotelId] = useState<string>(() => {
        const saved = sessionStorage.getItem('hotelId');
        return saved ? saved : "";
    });

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