
import { Wheat } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Wheat className="h-8 w-8 text-green-300" />
              <span className="text-2xl font-bold">GreenFields Farm</span>
            </div>
            <p className="text-green-100 mb-4 max-w-md">
              Committed to sustainable farming practices and providing fresh, healthy produce 
              to our community for over 70 years.
            </p>
            <p className="text-green-200 text-sm">
              © 2024 GreenFields Farm. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-green-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-green-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="text-green-100 hover:text-white transition-colors">Services</a></li>
              <li><a href="#products" className="text-green-100 hover:text-white transition-colors">Products</a></li>
              <li><a href="#contact" className="text-green-100 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Contact Info</h4>
            <div className="space-y-2 text-green-100">
              <p>123 Farm Road</p>
              <p>Green Valley, State 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@greenfieldsfarm.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-200">
            Made with ❤️ for sustainable agriculture and our community
          </p>
        </div>
      </div>
    </footer>
  );
};
