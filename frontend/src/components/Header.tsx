import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
    const { isLoggedIn } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = isLoggedIn ? (
        <>
            <Link
                className="flex items-center text-white px-4 py-2 font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                to="/my-bookings"
                onClick={closeMenu}
            >
                My Bookings
            </Link>
            <Link
                className="flex items-center text-white px-4 py-2 font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                to="/my-hotels"
                onClick={closeMenu}
            >
                My Hotels
            </Link>
            <SignOutButton />
        </>
    ) : (
        <Link
            to="/sign-in"
            className="bg-white flex items-center text-blue-600 px-5 py-2 font-bold rounded-lg hover:bg-blue-50 hover:shadow-md transition-all duration-300"
            onClick={closeMenu}
        >
            Sign In
        </Link>
    );

    return (
        <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-4 md:py-6 shadow-lg z-50">
            <div className="container mx-auto flex justify-between items-center px-4 md:px-0">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl md:text-3xl text-white font-bold tracking-tight hover:text-blue-200 transition-colors duration-300"
                >
                    BookMyStay.com
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-2 items-center">
                    {navLinks}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? (
                        <HiX className="w-6 h-6" />
                    ) : (
                        <HiMenu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2 border-t border-white/10 mt-4">
                    {navLinks}
                </nav>
            </div>
        </header>
    );
};

export default Header;
