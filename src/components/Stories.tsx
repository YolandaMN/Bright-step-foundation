import { Quote } from "lucide-react";

const stories = [
  {
    quote: "The foundation gave me more than shelter - they gave me hope. Today, I have a job, a home, and my children are back in school.",
    name: "Sarah M.",
    outcome: "Now employed and housed",
  },
  {
    quote: "After struggling with addiction for years, the rehabilitation program helped me find myself again. I'm two years sober and helping others now.",
    name: "James T.",
    outcome: "2 years sober, now a peer counselor",
  },
  {
    quote: "The education program opened doors I never thought possible. I completed my certificate and landed my dream job in tech.",
    name: "Maria L.",
    outcome: "Completed tech certification, employed",
  },
];

const Stories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stories of Transformation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real people, real change. See how our integrated approach is rebuilding lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-primary text-white rounded-xl p-8 relative"
            >
              <Quote className="h-12 w-12 opacity-20 absolute top-4 right-4" />
              <div className="relative z-10">
                <p className="text-lg mb-6 leading-relaxed">"{story.quote}"</p>
                <div className="border-t border-white/20 pt-4">
                  <p className="font-bold mb-1">{story.name}</p>
                  <p className="text-sm opacity-90">{story.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
