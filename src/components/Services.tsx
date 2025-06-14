
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Services = () => {
  const services = [
    {
      title: "Farm Tours",
      description: "Experience farm life up close with guided tours of our fields, learning about sustainable farming practices.",
      image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["Educational tours", "Group bookings", "Seasonal activities"]
    },
    {
      title: "Fresh Delivery",
      description: "Get farm-fresh produce delivered directly to your door with our weekly subscription service.",
      image: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["Weekly deliveries", "Seasonal boxes", "Custom orders"]
    },
    {
      title: "Farmers Market",
      description: "Visit us at local farmers markets where we sell our freshest produce and artisanal products.",
      image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      features: ["Weekend markets", "Seasonal specialties", "Direct farmer interaction"]
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-6">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From farm tours to fresh delivery, we offer various ways to connect you with sustainable agriculture
            and enjoy the freshest produce our farm has to offer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow bg-white">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-green-800">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
