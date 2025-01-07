// src/pages/Nosotras.jsx
import { Link } from "react-router-dom";
import {
  PencilIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  LockIcon,
  Users2Icon,
} from "lucide-react";

const Nosotras = () => {
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
              Sobre Nosotras
            </h1>
            <div className="flex gap-2 text-white/80">
              <Link to="/">Home</Link>
              <span>→</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotras Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <img
                src="/images/girls.jpg"
                alt="Beatriz y Verónica"
                className="w-full rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <span className="text-primary">Sobre Verónica Lopera</span>

              <h2 className="text-4xl font-light text-primary">
                Encuentra tu hogar ideal con Verónica Lopera. Contáctanos hoy y
                comencemos juntos este emocionante camino.
              </h2>

              <p className="text-gray-700">
                Somos Beatriz y Verónica, madre e hija, y hemos unido nuestra
                pasión y experiencia en el sector inmobiliario para ayudarte a
                encontrar el hogar perfecto. Con una visión complementaria,
                combinamos años de conocimiento del mercado con un enfoque
                personalizado.
              </p>

              <p className="text-gray-700">
                Nos distinguimos de las demás inmobiliarias por ofrecer un trato
                cercano, amable y con calidez humana. Un servicio único, donde
                cada detalle cuenta y tu felicidad es nuestra prioridad.
              </p>

              <p className="text-gray-700">
                Estamos aquí para acompañarte en cada paso del camino,
                asegurándonos de que encuentres la casa de tus sueños en la
                Costa Dorada y el Baix Penedés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary">Nuestros Valores</span>
            <h2 className="text-4xl font-light text-primary mt-2">
              Calidad en todos nuestros servicios
            </h2>
            <p className="mt-4 text-gray-700">
              Ofrecemos un servicio excepcional en cada detalle, comprometidos
              con la excelencia y la satisfacción de nuestros clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <PencilIcon className="w-6 h-6" />,
                title: "Pasión",
                description:
                  "Hacemos todo con dedicación y entusiasmo, buscando siempre superar expectativas.",
              },
              {
                icon: <UsersIcon className="w-6 h-6" />,
                title: "Comunidad",
                description:
                  "Fomentamos relaciones de confianza y apoyo con lo clientes y colaboradores.",
              },
              {
                icon: <CogIcon className="w-6 h-6" />,
                title: "Compromiso",
                description:
                  "Nos esforzamos por cumplir con lo prometido, brindando un servicio de calidad.",
              },
              {
                icon: <ChartBarIcon className="w-6 h-6" />,
                title: "Crecimiento",
                description:
                  "Estamos en constante evolución para ofrecer soluciones innovadoras y adaptadas al mercado.",
              },
              {
                icon: <LockIcon className="w-6 h-6" />,
                title: "Honestidad",
                description:
                  "Actuamos con transparencia, brindando información clara y sincera.",
              },
              {
                icon: <Users2Icon className="w-6 h-6" />,
                title: "Trabajo en equipo",
                description:
                  "Creemos en la colaboración para alcanzar los mejores resultados junto a nuestros clientes.",
              },
            ].map((valor, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-secondary mb-4">{valor.icon}</div>
                <h3 className="text-2xl font-light text-primary mb-2">
                  {valor.title}
                </h3>
                <p className="text-gray-700">{valor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotras;
