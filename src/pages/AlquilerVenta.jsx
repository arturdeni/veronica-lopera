import React, { useState, useEffect } from "react";
import { Search, Home, Bath, BedDouble } from "lucide-react";

// Importamos los servicios
import {
  getProperties,
  getPropertyTypes,
  getLocations,
} from "../services/inmovilla";

const AlquilerVenta = () => {
  // Estados
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    reference: "",
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Intentamos cargar las propiedades primero
        const propertiesData = await getProperties();
        setProperties(propertiesData);

        // Intentamos cargar los tipos y ubicaciones, pero no bloqueamos si fallan
        try {
          const typesData = await getPropertyTypes();
          setPropertyTypes(typesData);
        } catch (error) {
          console.warn("Failed to load property types:", error);
        }

        try {
          const locationsData = await getLocations();
          setLocations(locationsData);
        } catch (error) {
          console.warn("Failed to load locations:", error);
        }
      } catch (error) {
        setError("Error loading properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const filteredProperties = await getProperties(filters);
      setProperties(filteredProperties);
    } catch (error) {
      setError("Error applying filters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && !properties.length) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !properties.length) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh]">
        <img
          src="/images/hero.jpg"
          alt="Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <h1 className="text-white text-6xl font-light mb-6">
              Alquiler y Venta
            </h1>
            <div className="flex gap-2 text-white/80">
              <a href="/">Home</a>
              <span>→</span>
              <span>Alquiler y Venta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Tipo de propiedad</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas</option>
                {/* Mostramos un mensaje si no hay tipos disponibles */}
                {propertyTypes.length === 0 && (
                  <option disabled>No types available</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Población</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas</option>
                {/* Mostramos un mensaje si no hay ubicaciones disponibles */}
                {locations.length === 0 && (
                  <option disabled>No locations available</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Rango de precios</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Referencia</label>
              <input
                type="text"
                name="reference"
                placeholder="Referencia"
                value={filters.reference}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white p-3 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  "Buscando..."
                ) : (
                  <>
                    <Search size={20} />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property.cod_ofer}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src="/api/placeholder/400/300" // Aquí deberíamos usar la imagen real de la propiedad
                    alt={property.ref}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-light text-primary">
                    Ref: {property.ref}
                  </h3>

                  <div className="flex justify-between items-baseline">
                    <div className="space-y-1">
                      {property.nodisponible && (
                        <span className="text-red-500 text-sm">
                          No disponible
                        </span>
                      )}
                      {property.prospecto && (
                        <span className="text-blue-500 text-sm">Prospecto</span>
                      )}
                    </div>
                    <a
                      href={`/property/${property.cod_ofer}`}
                      className="text-primary hover:text-opacity-80 transition-colors"
                    >
                      + INFO
                    </a>
                  </div>

                  <div className="text-sm text-gray-500">
                    Última actualización:{" "}
                    {new Date(property.fechaact).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlquilerVenta;
