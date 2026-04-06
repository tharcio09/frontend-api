export function SkeletonDashboard() {
    return (
        <div className="animate-pulse w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-200 h-24"></div>

                <div className="px-6 pb-8">
                    <div className="relative -mt-12 mb-4 flex justify-center">
                        <div className="h-24 w-24 bg-gray-200 rounded-full border-4 border-white shadow-lg"></div>
                    </div>

                    <div className="text-center">
                        <div className="h-7 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mb-6"></div>

                        <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                            <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                        </div>

                        <div className="space-y-3 mt-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 bg-gray-100 rounded-xl w-full border border-gray-200"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}