// src/services/inmovilla-web/client.js - VERSIÓN CORREGIDA SIN process.env
import { INMOVILLA_CONFIG, validateInmovillaConfig } from "../../config/env.js";

class InmovillaWebClient {
  constructor(config = {}) {
    // Usar configuración centralizada en lugar de process.env
    this.config = {
      baseUrl: "/api/inmovilla-web",
      numagencia: config.numagencia || INMOVILLA_CONFIG.numagencia,
      addnumagencia: config.addnumagencia || INMOVILLA_CONFIG.addnumagencia,
      password: config.password || INMOVILLA_CONFIG.password,
      idioma: config.idioma || INMOVILLA_CONFIG.idioma,
      ...config,
    };

    // Validar que tenemos las credenciales necesarias
    if (!validateInmovillaConfig()) {
      throw new Error(
        "Missing Inmovilla API credentials. Check your .env.local file and ensure variables start with VITE_"
      );
    }

    console.log("🔧 Inmovilla Web Client initialized:", {
      numagencia: this.config.numagencia,
      hasPassword: !!this.config.password,
      addnumagencia: this.config.addnumagencia,
      idioma: this.config.idioma,
      baseUrl: this.config.baseUrl,
    });

    // Cache interno
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutos
  }

  /**
   * Realiza una petición a la API Web de Inmovilla
   */
  async makeRequest(procesos = [], json = true) {
    try {
      const cacheKey = JSON.stringify({ procesos, json });

      // Verificar caché
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log("✅ Using cached data");
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }

      console.log("🔄 Making request to Inmovilla Web API:", {
        procesos: procesos.length,
        json,
        numagencia: this.config.numagencia,
      });

      const response = await fetch(this.config.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numagencia: this.config.numagencia,
          addnumagencia: this.config.addnumagencia,
          password: this.config.password,
          idioma: this.config.idioma,
          procesos,
          json,
        }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Verificar si hay errores en la respuesta
      if (data.error) {
        console.error("❌ Inmovilla API Error:", data.error);
        throw new Error(data.error);
      }

      // Guardar en caché
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("❌ Inmovilla Web API Error:", error);
      throw error;
    }
  }

  /**
   * Obtiene tipos de propiedades
   */
  async getPropertyTypes() {
    const data = await this.makeRequest([
      {
        tipo: "tipos",
        posinicial: 1,
        numelementos: 100,
        where: "",
        orden: "",
      },
    ]);

    return data.tipos || [];
  }

  /**
   * Obtiene ciudades
   */
  async getCities() {
    const data = await this.makeRequest([
      {
        tipo: "ciudades",
        posinicial: 1,
        numelementos: 500,
        where: "",
        orden: "city ASC",
      },
    ]);

    return data.ciudades || [];
  }

  /**
   * Obtiene zonas de una ciudad
   */
  async getZones(cityId) {
    const data = await this.makeRequest([
      {
        tipo: "zonas",
        posinicial: 1,
        numelementos: 200,
        where: `cod_ciu = ${cityId}`,
        orden: "zone ASC",
      },
    ]);

    return data.zonas || [];
  }

  /**
   * Obtiene propiedades con filtros
   */
  async getProperties(filters = {}, page = 1, limit = 20) {
    // Convertir filtros a formato WHERE de MySQL
    const whereClause = this.buildWhereClause(filters);

    const data = await this.makeRequest([
      {
        tipo: "paginacion",
        posinicial: (page - 1) * limit + 1,
        numelementos: limit,
        where: whereClause,
        orden: "fechaact DESC",
      },
    ]);

    if (!data.paginacion || !Array.isArray(data.paginacion)) {
      return { items: [], metadata: { total: 0, page, limit } };
    }

    // El primer elemento contiene metadata
    const metadata = data.paginacion[0] || {};
    const items = data.paginacion.slice(1);

    return {
      items,
      metadata: {
        total: metadata.total || 0,
        page,
        limit,
        totalPages: Math.ceil((metadata.total || 0) / limit),
      },
    };
  }

  /**
   * Construye cláusula WHERE de MySQL para filtros
   */
  buildWhereClause(filters) {
    const conditions = [];

    // Tipo de propiedad
    if (filters.tipo) {
      conditions.push(`cod_tipo = ${filters.tipo}`);
    }

    // Ciudad
    if (filters.ciudad) {
      conditions.push(`cod_ciu = ${filters.ciudad}`);
    }

    // Zona
    if (filters.zona) {
      conditions.push(`cod_zona = ${filters.zona}`);
    }

    // Precio mínimo
    if (filters.precioMin) {
      conditions.push(`precioinmo >= ${filters.precioMin}`);
    }

    // Precio máximo
    if (filters.precioMax) {
      conditions.push(`precioinmo <= ${filters.precioMax}`);
    }

    // Habitaciones
    if (filters.habitaciones) {
      conditions.push(`total_hab >= ${filters.habitaciones}`);
    }

    // Baños
    if (filters.banyos) {
      conditions.push(`banyos >= ${filters.banyos}`);
    }

    // Metros cuadrados mínimos
    if (filters.metrosMin) {
      conditions.push(`m_uties >= ${filters.metrosMin}`);
    }

    // Metros cuadrados máximos
    if (filters.metrosMax) {
      conditions.push(`m_uties <= ${filters.metrosMax}`);
    }

    // Características especiales
    if (filters.piscina) {
      conditions.push(`(piscina_com = 1 OR piscina_prop = 1)`);
    }

    if (filters.parking) {
      conditions.push(`parking = 1`);
    }

    if (filters.ascensor) {
      conditions.push(`ascensor = 1`);
    }

    if (filters.aireAcondicionado) {
      conditions.push(`aire_con = 1`);
    }

    return conditions.join(" AND ");
  }

  /**
   * Obtiene detalles de una propiedad específica
   */
  async getPropertyDetail(propertyId) {
    const data = await this.makeRequest([
      {
        tipo: "ficha",
        posinicial: 1,
        numelementos: 1,
        where: `cod_ofer = ${propertyId}`,
        orden: "",
      },
    ]);

    return data.ficha && data.ficha[1] ? data.ficha[1] : null;
  }

  /**
   * Limpia la caché
   */
  clearCache() {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }
}

export default InmovillaWebClient;
