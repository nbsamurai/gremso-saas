export default function Newsletter() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-indigo-600 rounded-3xl py-12 px-6 sm:py-16 sm:px-12 lg:flex lg:items-center lg:p-20 border border-gray-800 shadow-2xl overflow-hidden relative">
          
          <div className="lg:w-0 lg:flex-1 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              Sign up for our newsletter to get the latest product updates, 
              industry insights, and exclusive tips delivered straight to your inbox.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8 relative z-10">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border border-transparent rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white focus:border-white sm:max-w-xs focus:outline-none transition-all duration-200"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-gray-400">
              We care about the protection of your data. Read our{' '}
              <a href="#" className="text-white font-medium underline underline-offset-2 hover:text-gray-200 transition-colors">
                Privacy Policy.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
