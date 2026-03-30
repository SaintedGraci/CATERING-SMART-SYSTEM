import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Catering Made
              <span className="text-orange-600"> Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create your perfect catering package in minutes. Choose from our curated selections or customize every detail to match your event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/packages"
                className="bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition text-center"
              >
                Browse Packages
              </Link>
              <Link
                href="/customize"
                className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition text-center"
              >
                Customize Your Own
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
