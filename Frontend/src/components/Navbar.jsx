import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          VU Exhibition 2025
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-secondary transition">Home</Link>
          <Link to="/bookings" className="hover:text-secondary transition">Book Now</Link>
          <Link to="/login" className="hover:text-secondary transition">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;