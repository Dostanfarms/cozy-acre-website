
import { Card, CardContent } from "@/components/ui/card";
import { Wheat, TreeDeciduous, Tractor } from "lucide-react";

export const About = () => {
  const values = [
    {
      icon: <Wheat className="h-8 w-8 text-green-600" />,
      title: "Sustainable Practices",
      description: "We use eco-friendly farming methods that preserve soil health and protect our environment for future generations."
    },
    {
      icon: <TreeDeciduous className="h-8 w-8 text-green-600" />,
      title: "Organic Commitment",
      description: "Our crops are grown without harmful pesticides or chemicals, ensuring pure, healthy produce for your family."
    },
    {
      icon: <Tractor className="h-8 w-8 text-green-600" />,
      title: "Modern Technology",
      description: "We combine traditional farming wisdom with cutting-edge technology to maximize yield and quality."
    }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-6">
            Our Story & Values
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            For over three generations, the GreenFields family has been dedicated to sustainable farming practices, 
            nurturing the land while providing fresh, healthy produce to our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-4">A Legacy of Excellence</h3>
            <p className="text-gray-600 mb-4">
              Founded in 1952 by our grandfather, GreenFields Farm started as a small family operation with big dreams. 
              Today, we've grown into a leading sustainable farm while maintaining our core values of quality, 
              integrity, and environmental stewardship.
            </p>
            <p className="text-gray-600">
              Our 500-acre farm is home to diverse crops, from seasonal vegetables to grains, all grown with care 
              and attention to both nutritional value and environmental impact.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Farm landscape"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h4 className="text-xl font-semibold text-green-800 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
