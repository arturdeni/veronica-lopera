// src/pages/Contacto.jsx
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  Instagram,
  Linkedin,
  Facebook,
  ChevronRight,
} from "lucide-react";

const Contacto = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <img
          src="/images/hero.jpg"
          alt="Costa Dorada"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <h1 className="text-white text-6xl font-light mb-6">
              Nuestro contacto
            </h1>
            <div className="flex gap-2 text-white/80">
              <Link to="/">Home</Link>
              <span>→</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="space-y-8">
              <div>
                <span className="text-primary">Contacto</span>
                <h2 className="text-4xl font-light text-primary mt-2">
                  ¿Quieres hablar con nosotras?
                </h2>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">
                    Tipo de servicio
                  </label>
                  <select className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Alquiler</option>
                    <option>Venta</option>
                    <option>Gestión de propiedades</option>
                    <option>Otros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-600">Mensaje</label>
                  <textarea
                    placeholder="Mensaje"
                    rows={4}
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    He leído y acepto los términos y condiciones de uso
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded hover:bg-opacity-90 transition-colors"
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <p className="text-gray-700">
                Encuentra tu hogar ideal con Verónica y Lopera. Contáctanos hoy
                y comencemos juntos este emocionante camino.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="w-6 h-6 text-secondary" />
                  <div>
                    <h3 className="text-xl font-light text-primary">
                      Dirección
                    </h3>
                    <p className="text-gray-700">
                      Av. Palfuriana 23, Bajos, Sant Salvador, 43880, Tarragona
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneIcon className="w-6 h-6 text-secondary" />
                  <div>
                    <h3 className="text-xl font-light text-primary">
                      Teléfono
                    </h3>
                    <p className="text-gray-700">+34 646 371 235</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MailIcon className="w-6 h-6 text-secondary" />
                  <div>
                    <h3 className="text-xl font-light text-primary">Email</h3>
                    <p className="text-gray-700">info@veronicalopera.com</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image */}
            <div>
              <img
                src="/images/about.jpg"
                alt="Propiedad"
                className="w-full rounded-lg"
              />
            </div>

            {/* FAQs */}
            <div>
              <span className="text-primary">FAQs</span>
              <h2 className="text-4xl font-light text-primary mt-2 mb-8">
                Preguntas frecuentes
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question:
                      "¿Qué tipo de propiedades están disponibles en la Costa Dorada?",
                    answer: "Respuesta...",
                  },
                  {
                    question:
                      "¿Cuál es el proceso para comprar una propiedad en la Costa Dorada?",
                    answer: "Respuesta...",
                  },
                  {
                    question:
                      "¿Cuáles son los costos adicionales al comprar una propiedad?",
                    answer: "Respuesta...",
                  },
                  {
                    question:
                      "¿Ofrecen servicios de gestión de propiedades para alquiler?",
                    answer: "Respuesta...",
                  },
                  {
                    question:
                      "¿Es posible comprar una propiedad como inversión en alquiler?",
                    answer: "Respuesta...",
                  },
                  {
                    question:
                      "¿Qué documentación necesito para comprar una propiedad en España?",
                    answer: "Respuesta...",
                  },
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <button
                      className="w-full flex justify-between items-center group"
                      onClick={() => console.log("Toggle FAQ")}
                    >
                      <span className="text-xl font-light text-primary">
                        {faq.question}
                      </span>
                      <ChevronRight className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96">
        <img
          src="/images/map.jpg"
          alt="Ubicación"
          className="w-full h-full object-cover"
        />
      </section>
    </div>
  );
};

export default Contacto;
