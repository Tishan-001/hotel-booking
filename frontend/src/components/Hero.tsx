const Hero = () => {
    return (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 pb-16 relative overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20"></div>
            <div className="container mx-auto flex flex-col gap-2 relative z-10">
                <h1 className="text-5xl text-white font-bold">
                    Find Your Next Stay
                </h1>
                <p className="text-2xl text-white/90">
                    Search Low Prices On Hotels For Your Dream Vacation...
                </p>
            </div>
        </div>
    );
};

export default Hero;
