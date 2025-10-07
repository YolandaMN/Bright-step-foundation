import Footer from "@/components/Footer";
import { Quote } from "lucide-react";

const Stories = () => {
  const stories = [
    {
      name: "Sarah M.",
      age: 16,
      story: "When I came to BrightStep Foundation, I had nowhere to go and felt completely lost. The counselors here didn't just give me a place to sleep—they gave me hope. Through their education program, I'm now back in school and dreaming of becoming a teacher myself one day.",
      image: "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?w=400&h=400&fit=crop"
    },
    {
      name: "Michael T.",
      age: 14,
      story: "I was living on the streets after my family fell apart. The rehabilitation program helped me deal with my trauma, and now I'm learning carpentry skills. I've discovered I love working with my hands, and I'm excited about building a future for myself.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Amina K.",
      age: 15,
      story: "Thanks to BrightStep's partnership with my school and their CAPS program, I'm not just catching up—I'm excelling. The volunteers here believe in me more than I believed in myself. Now I'm helping other kids who are going through what I went through.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
    },
    {
      name: "David L.",
      age: 17,
      story: "After years of abuse, I didn't think I could trust anyone. The therapists and mentors at BrightStep showed me what healthy relationships look like. I've been here for two years, and I'm now preparing to go to college—something I never thought possible.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Grace N.",
      age: 13,
      story: "I was pulled out of school by my circumstances, but BrightStep gave me a second chance. Their online courses and dedicated tutors helped me not just return to school, but become one of the top students in my class. I want to be a doctor now.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
    },
    {
      name: "James P.",
      age: 16,
      story: "The sports and arts programs at BrightStep helped me channel my energy in positive ways. I discovered I love painting, and my artwork has even been displayed in local galleries. This foundation doesn't just save lives—it helps us discover who we truly are.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="animate-on-scroll bg-gradient-to-r from-primary to-accent text-white py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Stories of Transformation</h1>
            <p className="text-xl opacity-90">
              Real stories from the children whose lives have been changed through your support
            </p>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="animate-on-scroll bg-secondary py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">820+</div>
                <div className="text-gray-600">Families Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">400+</div>
                <div className="text-gray-600">Volunteers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">1,200+</div>
                <div className="text-gray-600">Meals Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {stories.map((story, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <img 
                        src={story.image} 
                        alt={story.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{story.name}</h3>
                        <p className="text-gray-600">Age {story.age}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                      <p className="text-gray-600 leading-relaxed pl-6 italic">
                        "{story.story}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Every Child Has a Story</h2>
            <p className="text-xl opacity-90 mb-8">
              Behind every statistic is a real child with dreams, hopes, and unlimited potential. 
              Your support helps us write more stories of hope and transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/donate" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Support Their Journey
              </a>
              <a href="/volunteer" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors border-2 border-white">
                Become a Mentor
              </a>
            </div>
          </div>
        </section>

        {/* Call to Share */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Have a Story to Share?</h2>
            <p className="text-xl text-gray-600 mb-8">
              If you or someone you know has been impacted by BrightStep Foundation, we'd love to hear from you.
            </p>
            <a href="/report" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Share Your Story
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Stories;
