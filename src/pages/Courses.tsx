import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  caps_curriculum: "bg-[hsl(195_67%_30%)]",
  online: "bg-[hsl(195_67%_30%)]",
  vocational: "bg-[hsl(185_70%_30%)]",
  life_skills: "bg-[hsl(174_65%_42%)]",
};

// Add this **below categoryColors**
const categoryNames: { [key: string]: string } = {
  caps_curriculum: "CAPS Curriculum",
  online: "Online Learning",
  vocational: "Vocational Training",
  life_skills: "Life Skills",
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [showNotice, setShowNotice] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Slide-in notice
  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 3000);
    const timer2 = setTimeout(() => setShowNotice(false), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Fetch courses
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

      let fetchedCourses: Course[] = data || [];

      // Fill or duplicate until we have 9 cards
      while (fetchedCourses.length < 9) {
        fetchedCourses = [
          ...fetchedCourses,
          ...fetchedCourses.map((c, i) => ({
            ...c,
            id: `${c.id}-copy-${i}-${fetchedCourses.length}`,
          })),
        ];
      }

      fetchedCourses = fetchedCourses.slice(0, 9); // limit to exactly 9 cards

      setCourses(fetchedCourses);
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

  // Currently pasted 08.10
 const coursesWithDuplicates = [...courses, ...courses, ...courses];

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

        {/* Slide-in Notice */}
        {showNotice && (
          <div className="fixed top-20 right-4 z-[100]">
            <div
              className={`px-4 py-3 rounded-md shadow-lg font-medium
                ${fadeOut ? "animate-slide-out-right" : "animate-slide-in-right"}`}
              style={{ backgroundColor: "#DDCECD", color: "#000" }}
            >
              ⚠️ Notice: Only participants enrolled at our center can access these
              courses. Thank you for understanding!
            </div>
          </div>
        )}

        {/* Courses Grid */}
        <div className="text-center container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Available Courses</h2>
            <p className="text-gray-600">
              Browse our selection of courses designed to equip you with valuable
              skills for the future
            </p>
          </div>


        {loading ? (
  <div className="text-center py-12">
    <p className="text-gray-600">Loading courses...</p>
  </div>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map((course, index) => (
      <Card key={course.id} className="hover:shadow-lg transition-shadow w-[90%] mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className={`${categoryColors[course.category]} text-white px-2 py-1 rounded`}>
              {categoryNames[course.category]}
            </Badge>

            {/* <Badge className={`${categoryColors[course.category]} text-white px-2 py-1 rounded`}>
              {course.category.replace("_", " ")}
            </Badge> */}
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
              <span>
                {course.enrolled_count}/{course.capacity} enrolled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Starts {new Date(course.start_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[hsl(210_20%_20%)] text-white hover:bg-[hsl(210_25%_25%)]"
            asChild
          >
            <a href="/contact">Enroll Now</a>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
)}

        </div>

        {/* Partnership Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Education Partners</h3>
              <p className="text-gray-600 mb-4">
                We partner with leading educational institutions and platforms to
                provide quality education:
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
                Join hundreds of students transforming their futures through
                education
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
