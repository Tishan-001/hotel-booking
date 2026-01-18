import { useSearchContext } from "../contexts/SearchContext"
import { FormEvent, useState } from "react"
import { MdTravelExplore } from "react-icons/md";
import { HiUsers, HiCalendar } from "react-icons/hi";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const navigate = useNavigate()
    const search = useSearchContext()

    const [destination, setDestination] = useState<string>(search.destination)
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn)
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut)
    const [adultCount, setAdultCount] = useState<number>(search.adultCount)
    const [childrenCount, setChildrenCount] = useState<number>(search.childrenCount)

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()

        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childrenCount)
        navigate("/search")
    }

    const handleClear = () => {
        const today = new Date();

        setDestination("");
        setCheckIn(today);
        setCheckOut(today);
        setAdultCount(1);
        setChildrenCount(0);
    }

    const handleAdultCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setAdultCount(isNaN(value) ? 1 : Math.max(1, value));
    }

    const handleChildrenCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setChildrenCount(isNaN(value) ? 0 : Math.max(0, value));
    }

    const minDate = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)

    return (
        <form
            className="-mt-8 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
            onSubmit={handleSubmit}
        >
            {/* Destination Input */}
            <div className="flex flex-row items-center flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-blue-400 transition-colors duration-200 group">
                <MdTravelExplore size="24" className="mr-3 text-blue-600 group-hover:text-blue-700" />
                <input
                    placeholder="Where are you going?"
                    className="text-md w-full bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                    value={destination}
                    type="text"
                    onChange={event => setDestination(event.target.value)}
                />
            </div>

            {/* Guest Count */}
            <div className="flex items-center bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-blue-400 transition-colors duration-200 gap-4">
                <HiUsers size="22" className="text-blue-600 flex-shrink-0" />
                <div className="flex gap-4 flex-1">
                    <label className="flex items-center gap-2 flex-1">
                        <span className="text-slate-600 text-sm">Adults</span>
                        <input
                            className="w-14 p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-slate-700"
                            type="number"
                            min={1}
                            max={20}
                            value={adultCount.toString()}
                            onChange={handleAdultCountChange}
                        />
                    </label>
                    <label className="flex items-center gap-2 flex-1">
                        <span className="text-slate-600 text-sm">Children</span>
                        <input
                            className="w-14 p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-slate-700"
                            type="number"
                            min={0}
                            max={20}
                            value={childrenCount.toString()}
                            onChange={handleChildrenCountChange}
                        />
                    </label>
                </div>
            </div>

            {/* Check-in Date */}
            <div className="flex items-center bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-blue-400 transition-colors duration-200">
                <HiCalendar size="22" className="text-blue-600 mr-3 flex-shrink-0" />
                <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date as Date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in"
                    className="w-full bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400 cursor-pointer"
                    wrapperClassName="w-full"
                    dateFormat="MMM dd, yyyy"
                />
            </div>

            {/* Check-out Date */}
            <div className="flex items-center bg-slate-50 rounded-xl p-3 border border-slate-200 hover:border-blue-400 transition-colors duration-200">
                <HiCalendar size="22" className="text-blue-600 mr-3 flex-shrink-0" />
                <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date as Date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || minDate}
                    maxDate={maxDate}
                    placeholderText="Check-out"
                    className="w-full bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400 cursor-pointer"
                    wrapperClassName="w-full"
                    dateFormat="MMM dd, yyyy"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-slate-100 text-slate-600 py-3 px-4 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
                >
                    Clear
                </button>
            </div>
        </form>
    )
}

export default SearchBar