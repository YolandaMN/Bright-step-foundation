import { Home, HeartPulse, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    icon: Home,
    title: "Homeless Shelter",
    description: "Safe, temporary accommodation with 24/7 support. We provide a warm, secure environment where individuals and families can find stability and begin their journey to recovery.",
    features: ["Emergency Housing", "24/7 Support Staff", "Hot Meals Daily", "Case Management"],
  },
  {
    icon: HeartPulse,
    title: "Rehabilitation Center",
    description: "Comprehensive support programs, therapy, and healing services. Our holistic approach addresses physical, mental, and emotional wellbeing for lasting recovery.",
    features: ["Individual Therapy", "Group Counseling", "Medical Support", "Life Skills Training"],
  },
  {
    icon: BookOpen,
    title: "Education & Training Center",
    description: "CAPS curriculum, online programs, and vocational skills training. We partner with schools and platforms like Coursera to provide quality education and career opportunities.",
    features: ["CAPS Curriculum", "Online Courses", "Vocational Training", "Job Placement"],
  },
];

const Programs = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Integrated Longevity Model
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive approach to lasting transformation through shelter, rehabilitation, and education.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <program.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/programs">Learn More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
