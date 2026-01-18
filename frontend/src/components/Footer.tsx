const Footer = () => {
    return (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-3xl text-white font-bold tracking-tight">
                    BookMyStay.com
                </span>
                <span className="text-white/80 text-sm">
                    © 2026 BookMyStay. All rights reserved.
                </span>
                <span className="text-white font-medium tracking-tight flex gap-6">
                    <p className="cursor-pointer hover:text-blue-300 transition-colors duration-300">Privacy Policy</p>
                    <p className="cursor-pointer hover:text-blue-300 transition-colors duration-300">Terms of Service</p>
                    <p className="cursor-pointer hover:text-blue-300 transition-colors duration-300">Contact Us</p>
                </span>
            </div>
        </div>
    );
};

export default Footer;
