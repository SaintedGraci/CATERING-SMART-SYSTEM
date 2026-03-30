import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Create Your Perfect Event?
        </h2>
        <p className="text-xl text-orange-100 mb-8">
          Start customizing your catering package today and make your event unforgettable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/customize"
            className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Customizing
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
