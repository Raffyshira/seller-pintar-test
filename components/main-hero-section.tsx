import SearchArticle from "./hero-section/search-article";
import SelectCategory from "./hero-section/select-category";

export default function MainHeroSection() {
    return (
        <>
            <div className="min-h-[600px] relative bg-blue-500 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/img/hero-section-bg.jpg')", // Replace with your image URL
                    }}
                />
                <div className="absolute inset-0 bg-blue-600/80" />
                <div className="container mx-auto px-4 pt-16 pb-24 absolute left-1/2 bottom-1/2 translate-y-1/2 -translate-x-1/2 text-center">
                    <div className="text-white/90 mb-2 text-sm font-medium">Blog genzet</div>
                    <h1 className="text-white text-4xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight drop-shadow-lg">
                        The Journal : Design Resources, Interviews, and Industry News
                    </h1>
                    <p className="text-white/95 mt-6 text-xl drop-shadow-md">Your daily dose of design insights!</p>

                    {/* Search and Filter */}
                    <div className="max-w-2xl mx-auto mt-12 bg-white/40 p-1.5 rounded-md flex flex-col sm:flex-row gap-3">
                        <SelectCategory />
                        <SearchArticle />
                    </div>
                </div>
            </div>
        </>
    )
}
