import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const exhibitionFeatures = [
    {
      title: "Innovation Showcase",
      description: "Discover groundbreaking projects from our students",
      image: "/src/images/inno.jpg"
    },
    {
      title: "Career Opportunities",
      description: "Connect with top employers in various industries",
      image: "/src/images/career.jpg"
    },
    {
      title: "Research Presentations",
      description: "Learn about cutting-edge research from our faculty",
      image: "/src/images/present.jpg"
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Victoria University's Annual Exhibition</h1>
          <p className="text-xl mb-6">Join us for a showcase of innovation, research, and talent from our vibrant academic community.</p>
          <Link 
            to="/bookings" 
            className="bg-accent text-primary font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition inline-block"
          >
            Book Your Seat Now
          </Link>
        </motion.div>
      </section>

      {/* What to Expect */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">What to Expect</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {exhibitionFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-300 overflow-hidden">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mb-16 bg-gray-100 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">Pricing & Seating</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-secondary mb-4">Balcony Seating</h3>
            <p className="text-2xl font-bold mb-4">UGX 35,000</p>
            <ul className="space-y-2">
              <li>• General admission access</li>
              <li>• Exhibition booklet</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-secondary mb-4">Middle Seating</h3>
            <p className="text-2xl font-bold mb-4">UGX 75,000</p>
            <ul className="space-y-2">
              <li>• General admission access</li>
              <li>• Food vouchers</li>
              <li>• Exhibition booklet</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-secondary mb-4">Front Seating</h3>
            <p className="text-2xl font-bold mb-4">UGX 150,000</p>
            <ul className="space-y-2">
              <li>• Priority seating</li>
              <li>• Exclusive networking lounge</li>
              <li>• Full catering service</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-secondary mb-4">VIP Seating</h3>
            <p className="text-2xl font-bold mb-4">UGX 350,000</p>
            <ul className="space-y-2">
              <li>• Priority seating</li>
              <li>• Exclusive networking lounge</li>
              <li>• Full catering service</li>
              <li>• VIP parking</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;