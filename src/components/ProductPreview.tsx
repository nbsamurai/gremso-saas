export default function ProductPreview() {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            See How Zentivora Workspace Works
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Experience the intuitively designed interface that makes managing
            documents, tasks, and teams easier than ever.
          </p>
        </div>

        <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-5xl overflow-hidden mt-12 ring-1 ring-indigo-600/5 bg-gray-50 aspect-video group transition-transform duration-500 hover:scale-[1.01]">
          {/* Faux browser header */}
          <div className="bg-gray-100 flex items-center px-4 py-3 border-b border-gray-200">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto flex items-center bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200 text-xs text-gray-500 max-w-sm w-full truncate justify-center">
              <span className="truncate">app.zentivora.com/dashboard</span>
            </div>
          </div>

          {/* Faux content area */}
          <div className="p-8 flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-full rounded-tl-lg shadow-sm mr-6">
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-indigo-100 rounded w-24"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 shrink-0 transition-shadow hover:shadow-md">
                   <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                   <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 shrink-0 transition-shadow hover:shadow-md">
                   <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                   <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-32 bg-white rounded-xl shadow-sm border border-gray-100 p-4 shrink-0 transition-shadow hover:shadow-md">
                   <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                   <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
