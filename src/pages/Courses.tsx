import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_weeks: number;
  capacity: number;
  enrolled_count: number;
  start_date: string;
  status: string;
}

const categoryColors: { [key: string]: string } = {
  caps_curriculum: "bg-blue-500",
  online: "bg-green-500",
  vocational: "bg-orange-500",
  life_skills: "bg-purple-500",
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "open")
        .order("start_date", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-secondary">
        {/* Hero Section */}
        <div className="bg-primary text-white py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Educational & Skills Development Programs
            </h1>
            <p className="text-4xl md:text-2xl font-bold max-w-3xl mx-auto">
              Learn. Grow. Rise.
            </p>
          </div>
        </div>

        <div className="text-center bg-teal-100 text-teal-800 py-3 px-4 rounded-md mb-6 animate-pulseGrow" >
            <p>⚠️ Notice: Only participants enrolled at our center can access these courses. Thank you for understanding!</p>
        </div>

        {/* Courses Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Available Courses</h2>
            <p className="text-gray-600">
              Browse our selection of courses designed to equip you with valuable skills for the future
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={categoryColors[course.category]}>
                        {course.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolled_count}/{course.capacity} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Starts {new Date(course.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href="/contact">Enroll Now</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Partnership Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Education Partners</h3>
                <p className="text-gray-600 mb-4">
                  We partner with leading educational institutions and platforms to provide quality education:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    CAPS-aligned curriculum with local schools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Online courses through Coursera partnership
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Vocational training with industry professionals
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Life skills workshops and mentorship
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 text-center">
                <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold">
                  Join hundreds of students transforming their futures through education
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
