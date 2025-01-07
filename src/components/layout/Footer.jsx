// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <div className="text-2xl font-light mb-4">VL</div>
            <p className="text-sm mb-6">
              En Verónica Lopera, te ofrecemos un servicio integral para
              ayudarte a encontrar la propiedad de tus sueños
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-secondary hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold mb-4">Explore</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                to="/alquiler-venta"
                className="hover:text-white transition-colors"
              >
                Alquiler y Venta
              </Link>
              <Link
                to="/nosotras"
                className="hover:text-white transition-colors"
              >
                Nosotras
              </Link>
              <Link
                to="/contacto"
                className="hover:text-white transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>
                  Av. Palfuriana 23, Bajos, Sant Salvador, 43880, Tarragona
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>+34 646 371 235</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-5 h-5" />
                <span>info@veronicalopera.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-secondary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">Copyright © 2024 Iexmple</p>
            <div className="flex gap-4">
              <Link
                to="/privacidad"
                className="text-sm hover:text-white transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terminos"
                className="text-sm hover:text-white transition-colors"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
