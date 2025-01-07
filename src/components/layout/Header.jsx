// src/components/layout/Header.jsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-light text-primary">
          VL
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/alquiler-venta"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Alquiler y Venta
          </Link>
          <Link
            to="/nosotras"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Nosotras
          </Link>
          <Link
            to="/contacto"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Contacto
          </Link>
          <Link
            to="/valora-tu-piso"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Valora tu piso
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
