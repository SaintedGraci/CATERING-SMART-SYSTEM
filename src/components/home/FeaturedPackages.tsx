import Link from "next/link";

export default function FeaturedPackages() {
  const packages = [
    {
      name: "Corporate Lunch",
      price: "299",
      guests: "10-50",
      description: "Perfect for business meetings and office events"
    },
    {
      name: "Wedding Celebration",
      price: "1,499",
      guests: "50-200",
      description: "Elegant dining for your special day"
    },
    {
      name: "Birthday Party",
      price: "399",
      guests: "20-75",
      description: "Fun and delicious for all ages"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Packages</h2>
          <p className="text-xl text-gray-600">Popular choices for every occasion</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{pkg.guests} guests</span>
                  <span className="text-2xl font-bold text-orange-600">${pkg.price}</span>
                </div>
                <Link
                  href="/packages"
                  className="block w-full bg-orange-600 text-white text-center px-6 py-3 rounded-full hover:bg-orange-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
