
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Products = () => {
  const products = [
    {
      category: "Vegetables",
      items: ["Organic Tomatoes", "Fresh Lettuce", "Bell Peppers", "Carrots", "Broccoli", "Spinach"],
      season: "Year-round",
      color: "bg-green-100 text-green-800"
    },
    {
      category: "Fruits",
      items: ["Strawberries", "Apples", "Pears", "Blueberries", "Raspberries", "Blackberries"],
      season: "Seasonal",
      color: "bg-red-100 text-red-800"
    },
    {
      category: "Grains & Legumes",
      items: ["Organic Wheat", "Corn", "Soybeans", "Black Beans", "Lentils", "Quinoa"],
      season: "Harvest Season",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      category: "Herbs",
      items: ["Basil", "Rosemary", "Thyme", "Oregano", "Parsley", "Cilantro"],
      season: "Year-round",
      color: "bg-green-100 text-green-800"
    }
  ];

  return (
    <section id="products" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-6">
            Our Fresh Products
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From crisp vegetables to sweet fruits, our diverse selection of organic produce is grown with care
            and harvested at peak freshness to deliver maximum flavor and nutrition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-green-800">{product.category}</CardTitle>
                  <Badge className={product.color}>{product.season}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.items.map((item, idx) => (
                    <li key={idx} className="text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-green-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Custom Orders Available</h3>
          <p className="text-gray-600 mb-6">
            Need something specific? We can accommodate custom orders for restaurants, events, or bulk purchases.
            Contact us to discuss your requirements and we'll work with you to provide exactly what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-green-700 border-green-300">Bulk Orders</Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">Restaurant Supply</Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">Event Catering</Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">Special Requests</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
