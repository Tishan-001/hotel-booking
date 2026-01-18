import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            {/* 404 Illustration */}
            <div className="relative mb-8">
                <span className="text-[150px] md:text-[200px] font-bold text-blue-100 select-none">
                    404
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        404
                    </span>
                </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Page Not Found
            </h1>
            <p className="text-lg text-slate-600 max-w-md mb-8">
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
                >
                    Go Home
                </Link>
                <Link
                    to="/search"
                    className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                    Search Hotels
                </Link>
            </div>

            {/* Decorative Elements */}
            <div className="mt-12 flex gap-4 text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-200"></div>
            </div>
        </div>
    );
};

export default NotFoundPage;
