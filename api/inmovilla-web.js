// api/inmovilla-web.js
/**
 * Endpoint para la API Web de Inmovilla
 * Actúa como proxy y adaptador entre el frontend React y la API PHP legacy
 */

const INMOVILLA_API_URL = "https://apiweb.inmovilla.com/apiweb/apiweb.php";

export default async function handler(req, res) {
  // Manejar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const {
      numagencia,
      addnumagencia = "",
      password,
      idioma = 1,
      procesos = [],
      json = true,
    } = req.body;

    // Validar parámetros requeridos
    if (!numagencia || !password) {
      res.status(400).json({
        error: "Missing required parameters: numagencia, password",
      });
      return;
    }

    console.log("🔄 Processing Inmovilla Web API request:", {
      numagencia,
      processCount: procesos.length,
      idioma,
    });

    // Construir el texto de petición según formato de la API
    let requestText = `${numagencia}${addnumagencia};${password};${idioma};lostipos`;

    // Añadir cada proceso
    procesos.forEach((proceso) => {
      requestText += `;${proceso.tipo};${proceso.posinicial};${proceso.numelementos};${proceso.where};${proceso.orden}`;
    });

    // Preparar parámetros para la API
    const formData = new URLSearchParams();
    formData.append("param", requestText);
    formData.append("elDominio", req.headers.host || "localhost");

    if (json) {
      formData.append("json", "1");
    }

    console.log("📤 Sending to Inmovilla:", {
      url: INMOVILLA_API_URL,
      textLength: requestText.length,
      json,
    });

    // Realizar petición a Inmovilla
    const response = await fetch(INMOVILLA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; Veronica-Lopera-Web/1.0)",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `Inmovilla API returned ${response.status}: ${response.statusText}`
      );
    }

    const responseText = await response.text();
    console.log("📥 Response from Inmovilla:", {
      status: response.status,
      contentLength: responseText.length,
      isJson: json,
    });

    // Si solicitamos JSON, parsear la respuesta
    if (json) {
      try {
        const jsonData = JSON.parse(responseText);

        // Procesar y limpiar los datos
        const processedData = processInmovillaResponse(jsonData, procesos);

        res.status(200).json(processedData);
      } catch (parseError) {
        console.error("❌ JSON Parse error:", parseError);
        console.log("Raw response:", responseText.substring(0, 500));

        res.status(500).json({
          error: "Invalid JSON response from Inmovilla API",
          rawResponse: responseText.substring(0, 500),
        });
      }
    } else {
      // Devolver respuesta cruda (para debugging)
      res.status(200).json({
        raw: responseText,
        processed: false,
      });
    }
  } catch (error) {
    console.error("❌ Inmovilla Web API Error:", error);

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Procesa y limpia la respuesta de la API de Inmovilla
 */
function processInmovillaResponse(rawData, procesos) {
  const processedData = {};

  // Mapear cada tipo de proceso solicitado
  procesos.forEach((proceso) => {
    const tipo = proceso.tipo;

    if (rawData[tipo]) {
      processedData[tipo] = processDataByType(rawData[tipo], tipo);
    }
  });

  // Copiar otros datos que puedan venir (descripciones, fotos, videos)
  ["descripciones", "fotos", "videos", "antesydespues"].forEach((key) => {
    if (rawData[key]) {
      processedData[key] = rawData[key];
    }
  });

  return processedData;
}

/**
 * Procesa datos según el tipo
 */
function processDataByType(data, tipo) {
  if (!Array.isArray(data)) {
    return data;
  }

  switch (tipo) {
    case "paginacion":
    case "destacados":
      return processPropertiesList(data);

    case "ficha":
      return processPropertyDetail(data);

    case "tipos":
      return processPropertyTypes(data);

    case "ciudades":
      return processCities(data);

    case "zonas":
      return processZones(data);

    default:
      return data;
  }
}

/**
 * Procesa lista de propiedades
 */
function processPropertiesList(data) {
  if (!data || data.length === 0) return data;

  // El primer elemento contiene metadata
  const processedData = [...data];

  // Limpiar y validar propiedades
  for (let i = 1; i < processedData.length; i++) {
    if (processedData[i]) {
      processedData[i] = cleanPropertyData(processedData[i]);
    }
  }

  return processedData;
}

/**
 * Procesa detalle de propiedad
 */
function processPropertyDetail(data) {
  if (!data || data.length === 0) return data;

  // Limpiar datos de la ficha
  const processedData = [...data];
  if (processedData[1]) {
    processedData[1] = cleanPropertyData(processedData[1]);
  }

  return processedData;
}

/**
 * Procesa tipos de propiedades
 */
function processPropertyTypes(data) {
  return data.map((tipo) => ({
    cod_tipo: parseInt(tipo.cod_tipo) || 0,
    tipo: cleanString(tipo.tipo) || "Sin especificar",
  }));
}

/**
 * Procesa ciudades
 */
function processCities(data) {
  return data.map((ciudad) => ({
    cod_ciu: parseInt(ciudad.cod_ciu) || 0,
    city: cleanString(ciudad.city) || "Sin especificar",
    provincia: cleanString(ciudad.provincia) || "",
    isla: cleanString(ciudad.isla) || "",
    codprov: parseInt(ciudad.codprov) || 0,
  }));
}

/**
 * Procesa zonas
 */
function processZones(data) {
  return data.map((zona) => ({
    cod_zona: parseInt(zona.cod_zona) || 0,
    zone: cleanString(zona.zone) || "Sin especificar",
  }));
}

/**
 * Limpia datos de una propiedad
 */
function cleanPropertyData(property) {
  const cleaned = { ...property };

  // Convertir números
  const numericFields = [
    "cod_ofer",
    "keyacci",
    "precioinmo",
    "outlet",
    "precioalq",
    "numfotos",
    "numagencia",
    "m_parcela",
    "m_uties",
    "m_cons",
    "m_terraza",
    "banyos",
    "aseos",
    "habdobles",
    "habitaciones",
    "total_hab",
    "distmar",
    "ascensor",
    "aire_con",
    "parking",
    "piscina_com",
    "piscina_prop",
    "diafano",
    "todoext",
    "calefaccion",
    "planta",
    "numplanta",
    "antiguedad",
    "energiavalor",
    "emisionesvalor",
    "latitud",
    "longitud",
    "x_entorno",
  ];

  numericFields.forEach((field) => {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      const parsed = parseFloat(cleaned[field]);
      cleaned[field] = isNaN(parsed) ? 0 : parsed;
    }
  });

  // Limpiar strings
  const stringFields = [
    "ref",
    "nbtipo",
    "ciudad",
    "zona",
    "tipomensual",
    "foto",
    "calle",
    "energialetra",
    "emisionesletra",
  ];

  stringFields.forEach((field) => {
    if (cleaned[field]) {
      cleaned[field] = cleanString(cleaned[field]);
    }
  });

  // Validar y formatear fechas
  if (cleaned.fechaact) {
    try {
      // Asegurar formato válido de fecha
      const date = new Date(cleaned.fechaact);
      if (!isNaN(date.getTime())) {
        cleaned.fechaact = date.toISOString().slice(0, 19).replace("T", " ");
      }
    } catch (e) {
      console.warn("Invalid date format:", cleaned.fechaact);
    }
  }

  return cleaned;
}

/**
 * Limpia strings de caracteres extraños
 */
function cleanString(str) {
  if (typeof str !== "string") return str;

  return str
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, "") // Remover caracteres de control
    .replace(/\s+/g, " "); // Normalizar espacios
}

/**
 * Información de debugging del endpoint
 */
export const config = {
  maxDuration: 30, // 30 segundos timeout
  regions: ["fra1"], // Región europea más cercana a España
};
