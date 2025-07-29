// src/services/inmovilla-web/client.js - VERSIÓN CORREGIDA
class InmovillaWebClient {
  constructor(config = {}) {
    this.config = {
      baseUrl: "/api/inmovilla-web",
      // ✅ CORREGIDO - Usar variables REACT_APP_
      numagencia: config.numagencia || process.env.REACT_APP_INMOVILLA_AGENCY,
      addnumagencia:
        config.addnumagencia ||
        process.env.REACT_APP_INMOVILLA_USER_SUFFIX ||
        "",
      password: config.password || process.env.REACT_APP_INMOVILLA_PASSWORD,
      idioma:
        config.idioma ||
        parseInt(process.env.REACT_APP_INMOVILLA_LANGUAGE) ||
        1,
      ...config,
    };

    // Validar que tenemos las credenciales necesarias
    if (!this.config.numagencia || !this.config.password) {
      console.error("❌ Missing Inmovilla credentials:", {
        numagencia: !!this.config.numagencia,
        password: !!this.config.password,
      });
      throw new Error(
        "Missing Inmovilla API credentials. Check your .env.local file."
      );
    }

    console.log("🔧 Inmovilla Web Client initialized:", {
      numagencia: this.config.numagencia,
      hasPassword: !!this.config.password,
      idioma: this.config.idioma,
      baseUrl: this.config.baseUrl,
    });

    // Cache interno
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutos
  }

  /**
   * Realiza una petición a la API Web de Inmovilla
   * @param {Array} procesos - Array de procesos a ejecutar
   * @param {boolean} json - Si devolver JSON o PHP serializado
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

      console.log("✅ Request successful:", Object.keys(data));
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
    console.log("🔄 Loading property types...");

    const procesos = [
      {
        tipo: "tipos",
        posinicial: 1,
        numelementos: 100,
        where: "",
        orden: "",
      },
    ];

    const result = await this.makeRequest(procesos);
    const formatted = this.formatPropertyTypes(result.tipos || []);

    console.log(`✅ Property types loaded: ${formatted.length}`);
    return formatted;
  }

  /**
   * Obtiene ciudades
   */
  async getCities() {
    console.log("🔄 Loading cities...");

    const procesos = [
      {
        tipo: "ciudades",
        posinicial: 1,
        numelementos: 100,
        where: "",
        orden: "",
      },
    ];

    const result = await this.makeRequest(procesos);
    const formatted = this.formatCities(result.ciudades || []);

    console.log(`✅ Cities loaded: ${formatted.length}`);
    return formatted;
  }

  /**
   * Obtiene zonas de una ciudad
   */
  async getZones(cityId) {
    console.log(`🔄 Loading zones for city: ${cityId}`);

    const procesos = [
      {
        tipo: "zonas",
        posinicial: 1,
        numelementos: 100,
        where: `key_loca=${cityId}`,
        orden: "",
      },
    ];

    const result = await this.makeRequest(procesos);
    const formatted = this.formatZones(result.zonas || []);

    console.log(`✅ Zones loaded: ${formatted.length}`);
    return formatted;
  }

  /**
   * Obtiene listado de propiedades con filtros
   */
  async getProperties(filters = {}, page = 1, itemsPerPage = 20) {
    console.log("🔄 Loading properties...", { filters, page, itemsPerPage });

    const numregistro = (page - 1) * itemsPerPage + 1;
    const whereClause = this.buildWhereClause(filters);
    const ordenClause = filters.sort || "fechaact desc";

    const procesos = [
      {
        tipo: "paginacion",
        posinicial: numregistro,
        numelementos: itemsPerPage,
        where: whereClause,
        orden: ordenClause,
      },
    ];

    const result = await this.makeRequest(procesos);
    const formatted = this.formatPropertiesList(result.paginacion || []);

    console.log(`✅ Properties loaded: ${formatted.items?.length || 0}`);
    return formatted;
  }

  /**
   * Obtiene detalle completo de una propiedad
   */
  async getPropertyDetail(codOfer) {
    console.log(`🔄 Loading property detail: ${codOfer}`);

    const procesos = [
      {
        tipo: "ficha",
        posinicial: 1,
        numelementos: 1,
        where: `ofertas.cod_ofer=${codOfer}`,
        orden: "",
      },
    ];

    const result = await this.makeRequest(procesos);
    const formatted = this.formatPropertyDetail(result, codOfer);

    console.log(`✅ Property detail loaded: ${formatted.ref}`);
    return formatted;
  }

  // ... resto de métodos igual que antes ...

  /**
   * Construye la cláusula WHERE basada en filtros
   */
  buildWhereClause(filters) {
    const conditions = [];

    if (filters.propertyType) {
      conditions.push(`key_tipo=${filters.propertyType}`);
    }

    if (filters.location) {
      conditions.push(`key_loca=${filters.location}`);
    }

    if (filters.zone) {
      conditions.push(`key_zona=${filters.zone}`);
    }

    if (filters.minPrice) {
      conditions.push(
        `(precioinmo >= ${filters.minPrice} OR precioalq >= ${filters.minPrice})`
      );
    }

    if (filters.maxPrice) {
      conditions.push(
        `(precioinmo <= ${filters.maxPrice} OR precioalq <= ${filters.maxPrice})`
      );
    }

    if (filters.rooms) {
      conditions.push(`(habdobles + habitaciones) >= ${filters.rooms}`);
    }

    if (filters.minSurface) {
      conditions.push(`m_cons >= ${filters.minSurface}`);
    }

    if (filters.reference) {
      conditions.push(`ref LIKE '%${filters.reference}%'`);
    }

    // Por defecto, solo propiedades disponibles
    if (!filters.includeUnavailable) {
      conditions.push("estadoficha = 1"); // 1 = Libre
    }

    const whereClause = conditions.join(" AND ");
    console.log("🔍 WHERE clause:", whereClause);

    return whereClause;
  }

  /**
   * Formatea tipos de propiedades
   */
  formatPropertyTypes(tipos) {
    if (!Array.isArray(tipos)) {
      console.warn("⚠️ Property types is not an array:", tipos);
      return [];
    }

    return tipos.map((tipo) => ({
      value: tipo.cod_tipo?.toString() || "",
      label: tipo.tipo || "Sin especificar",
      originalData: tipo,
    }));
  }

  /**
   * Formatea ciudades
   */
  formatCities(ciudades) {
    if (!Array.isArray(ciudades)) {
      console.warn("⚠️ Cities is not an array:", ciudades);
      return [];
    }

    return ciudades.map((ciudad) => ({
      value: ciudad.cod_ciu?.toString() || "",
      label: ciudad.city || "Sin especificar",
      province: ciudad.provincia || "",
      originalData: ciudad,
    }));
  }

  /**
   * Formatea zonas
   */
  formatZones(zonas) {
    if (!Array.isArray(zonas)) {
      console.warn("⚠️ Zones is not an array:", zonas);
      return [];
    }

    return zonas.map((zona) => ({
      value: zona.cod_zona?.toString() || "",
      label: zona.zone || "Sin especificar",
      originalData: zona,
    }));
  }

  /**
   * Formatea listado de propiedades
   */
  formatPropertiesList(properties) {
    if (!Array.isArray(properties)) {
      console.warn("⚠️ Properties is not an array:", properties);
      return { items: [], metadata: { total: 0, position: 1, count: 0 } };
    }

    // El primer elemento [0] contiene metadata
    const metadata = properties[0] || {};
    const items = properties.slice(1);

    const formattedItems = items.map((property) =>
      this.formatProperty(property)
    );

    return {
      items: formattedItems,
      metadata: {
        total: metadata.total || 0,
        position: metadata.posicion || 1,
        count: metadata.elementos || items.length,
      },
    };
  }

  /**
   * Formatea una propiedad individual
   */
  formatProperty(property) {
    if (!property) return null;

    return {
      id: property.cod_ofer,
      ref: property.ref || "Sin ref",

      // Precios
      salePrice: property.precioinmo || null,
      rentPrice: property.precioalq || null,
      previousPrice: property.outlet || null,
      formattedPrice: this.formatPrice(property),

      // Tipo y acción
      operationType: this.getOperationType(property.keyacci),
      operationTypeId: property.keyacci,
      propertyType: property.nbtipo || "Sin especificar",

      // Ubicación
      city: property.ciudad || "",
      zone: property.zona || "",

      // Características básicas
      rooms: (property.habdobles || 0) + (property.habitaciones || 0),
      doubleRooms: property.habdobles || 0,
      singleRooms: property.habitaciones || 0,
      bathrooms: property.banyos || 0,
      toilets: property.aseos || 0,

      // Superficie
      builtSurface: property.m_cons || 0,
      usefulSurface: property.m_uties || 0,
      plotSurface: property.m_parcela || 0,
      terraceSurface: property.m_terraza || 0,

      // Características especiales
      features: {
        elevator: property.ascensor === 1,
        airConditioning: property.aire_con === 1,
        heating: property.calefaccion === 1,
        communityPool: property.piscina_com === 1,
        privatePool: property.piscina_prop === 1,
        parking: property.parking > 0,
        parkingIncluded: property.parking === 2,
        allExterior: property.todoext === 1,
        openPlan: property.diafano === 1,
      },

      // Imágenes
      numPhotos: property.numfotos || 0,
      mainPhoto: property.foto || null,
      imageUrl: property.foto || null,

      // Ubicación especial
      distanceToSea: property.distmar || null,
      distanceToSeaFormatted: property.distmar ? `${property.distmar}m` : null,

      // Metadatos
      agencyId: property.numagencia,
      lastUpdate: property.fechaact,
      formattedDate: property.fechaact
        ? new Date(property.fechaact).toLocaleDateString("es-ES")
        : null,

      // Estado
      available: true, // Asumimos disponible si está en el listado

      // Datos originales por si necesitamos algo más
      originalData: property,
    };
  }

  /**
   * Formatea detalle completo de propiedad
   */
  formatPropertyDetail(result, codOfer) {
    const ficha = result.ficha && result.ficha[1] ? result.ficha[1] : {};
    const descripciones =
      result.descripciones && result.descripciones[codOfer]
        ? result.descripciones[codOfer]
        : {};
    const fotos =
      result.fotos && result.fotos[codOfer] ? result.fotos[codOfer] : [];
    const videos =
      result.videos && result.videos[codOfer] ? result.videos[codOfer] : [];

    const basicProperty = this.formatProperty(ficha);
    if (!basicProperty) {
      throw new Error("Property not found");
    }

    return {
      ...basicProperty,

      // Descripciones por idioma
      title: descripciones[1]?.titulo || basicProperty.ref,
      description: descripciones[1]?.descrip || "",
      descriptions: descripciones,

      // Galería completa
      images: fotos.map((url, index) => ({
        id: index + 1,
        url: url,
        alt: `${basicProperty.ref} - Imagen ${index + 1}`,
        isMain: index === 0,
      })),

      // Videos de YouTube
      videos: videos.map((videoId) => ({
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      })),
    };
  }

  /**
   * Formatea precio según tipo de operación
   */
  formatPrice(property) {
    if (property.precioinmo) {
      return `${property.precioinmo.toLocaleString("es-ES")}€`;
    }
    if (property.precioalq) {
      const period = property.tipomensual || "mes";
      return `${property.precioalq.toLocaleString(
        "es-ES"
      )}€/${period.toLowerCase()}`;
    }
    return null;
  }

  /**
   * Obtiene tipo de operación legible
   */
  getOperationType(keyacci) {
    const types = {
      1: "Venta",
      2: "Alquiler",
      3: "Traspaso",
      4: "Venta o Alquiler",
      9: "Alquiler Vacacional",
    };
    return types[keyacci] || "N/A";
  }

  /**
   * Limpia el caché
   */
  clearCache() {
    this.cache.clear();
    console.log("🧹 Cache cleared");
  }
}

export default InmovillaWebClient;
