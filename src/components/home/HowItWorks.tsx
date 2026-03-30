export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Choose Your Package",
      description: "Browse our curated packages or start from scratch. Filter by event type, guest count, and dietary preferences."
    },
    {
      number: 2,
      title: "Customize Everything",
      description: "Swap items, adjust quantities, and add special requests. See real-time pricing as you build your perfect menu."
    },
    {
      number: 3,
      title: "Relax & Enjoy",
      description: "We handle everything from preparation to delivery. Track your order and enjoy stress-free catering."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Three simple steps to perfect catering</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-orange-600">{step.number}</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
