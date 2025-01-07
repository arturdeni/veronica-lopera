// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { Home as HomeIcon, Building2, Users, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen">
        <img
          src="/images/hero.jpg"
          alt="Costa Dorada"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col justify-center">
          <div className="container mx-auto px-6 pt-20">
            <p className="text-white mb-4">Bienvenidos a Verónica Lopera</p>
            <h1 className="text-white text-6xl font-light leading-tight mb-8">
              Servicios inmobiliarios
              <br />
              en la Costa Dorada y el
              <br />
              Garraf.
            </h1>

            <p className="text-white text-xl max-w-2xl mb-12">
              En Verónica Lopera, te ofrecemos un servicio integral para
              ayudarte a encontrar la propiedad de tus sueños en una de las
              zonas más privilegiadas del Mediterráneo.
            </p>

            <div className="flex gap-4">
              <Link
                to="/contacto"
                className="bg-white text-primary px-6 py-3 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Contacto <ArrowRight size={20} />
              </Link>
              <Link
                to="/alquiler-venta"
                className="bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                Alquiler/Compra <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotras Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <span className="text-primary">Sobre Verónica Lopera</span>

              <h2 className="text-4xl font-light text-primary">
                El hogar es donde comienza tu historia
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="text-gray-700">
                  Beatriz y Verónica, madre e hija, han unido su pasión y
                  experiencia en el sector inmobiliario para ayudarte a
                  encontrar el hogar perfecto. Con una visión compartida y
                  complementaria, combinan décadas de conocimiento del mercado
                  con un enfoque cercano y personalizado.
                </p>

                <p className="text-gray-700">
                  Juntas, te ofrecen un servicio único, donde cada detalle es
                  importante y donde tu satisfacción es nuestra prioridad.
                  Nuestra misión es acompañarte en cada paso del proceso, para
                  que encuentres el hogar de tus sueños en la Costa Dorada.
                </p>
              </div>

              <Link
                to="/nosotras"
                className="inline-flex items-center gap-2 text-primary border border-primary rounded-full px-6 py-2 hover:bg-primary hover:text-white transition-colors"
              >
                Saber más <ArrowRight size={20} />
              </Link>
            </div>

            <div>
              <img
                src="/images/about.jpg"
                alt="Costa Dorada"
                className="w-full h-full object-cover rounded-lg"
              />

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-light text-primary">10</span>
                  <span className="text-xl text-primary">+</span>
                  <span className="text-gray-600 ml-2">
                    Años de experiencia
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-light text-primary">50</span>
                  <span className="text-xl text-primary">+</span>
                  <span className="text-gray-600 ml-2">Vendidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <span className="text-primary">Nuestros servicios</span>
            <h2 className="text-4xl font-light text-primary mt-2">
              Lo mejor en el negocio
            </h2>
            <p className="mt-4 text-gray-700 max-w-2xl">
              Nos especializamos en ofrecer servicios inmobiliarios de alta
              calidad en la Costa Dorada. Con años de experiencia en el sector,
              brindamos soluciones personalizadas para satisfacer todas tus
              necesidades de compra, alquiler y gestión de propiedades.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Venta */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HomeIcon className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-light text-primary">
                  Venta de propiedad
                </h3>
              </div>
              <p className="text-gray-700">
                Te ayudamos a vender tu propiedad de manera rápida y eficiente,
                maximizando su valor en el mercado actual. Nos encargamos de
                todo el proceso, desde la valoración hasta el cierre de la
                venta.
              </p>
            </div>

            {/* Alquiler */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-light text-primary">
                  Alquiler de propiedad
                </h3>
              </div>
              <p className="text-gray-700">
                Gestionamos el alquiler de tu propiedad asegurando inquilinos
                confiables y rentas competitivas. Nos ocupamos de la publicidad,
                selección de inquilinos y contratos para garantizar una
                experiencia sin complicaciones.
              </p>
            </div>

            {/* Gestión */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-light text-primary">
                  Gestión de Propiedad
                </h3>
              </div>
              <p className="text-gray-700">
                Ofrecemos un servicio integral de gestión de propiedades,
                ocupándonos de su mantenimiento, administración y cualquier
                necesidad que surja. Nos aseguramos de que tu propiedad esté
                siempre en óptimas condiciones.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 text-primary border border-primary rounded-full px-6 py-2 hover:bg-primary hover:text-white transition-colors"
            >
              Contacto <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
