import { Users, Heart, Utensils, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "820+",
    label: "Families Supported",
  },
  {
    icon: Heart,
    value: "400+",
    label: "Volunteers",
  },
  {
    icon: Utensils,
    value: "1,200+",
    label: "Meals Served",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Difference We're Making Together
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
