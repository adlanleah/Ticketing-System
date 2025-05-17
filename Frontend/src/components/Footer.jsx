const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Victoria University</h3>
            <p>Providing quality education and fostering innovation in Uganda since 2010.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-secondary transition">About the Exhibition</a></li>
              <li><a href="#" className="hover:text-secondary transition">Book a Seat</a></li>
              <li><a href="#" className="hover:text-secondary transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <address className="not-italic">
              <p>Plot 1-13 Jinja Road</p>
              <p>Kampala, Uganda</p>
              <p>Phone: +256 414 123 456</p>
              <p>Email: info@vu.ac.ug</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© 2025 Victoria University Uganda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;