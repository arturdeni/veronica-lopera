// api/inmovilla/[...path].js
export default async function handler(req, res) {
  // Manejar CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Token"
    );
    res.status(200).end();
    return;
  }

  const { path } = req.query;

  // Construir el path - path es un array cuando usamos [...path]
  let pathString = "";
  if (Array.isArray(path)) {
    pathString = path.join("/");
  } else if (path) {
    pathString = path;
  }

  // Construir la URL completa hacia la API de Inmovilla
  const baseUrl = "https://procesos.inmovilla.com/api/v1";
  let targetUrl = `${baseUrl}/${pathString}`;

  // Añadir query parameters si los hay (excluyendo 'path' que es interno de Next.js)
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach((key) => {
    if (key !== "path") {
      queryParams.append(key, req.query[key]);
    }
  });

  if (queryParams.toString()) {
    targetUrl += `?${queryParams.toString()}`;
  }

  console.log(`🌐 Proxying request to: ${targetUrl}`);

  try {
    // Headers requeridos por la API de Inmovilla
    const headers = {
      "Content-Type": "application/json",
      Token: process.env.INMOVILLA_TOKEN || "0F6399CF144116F22D567B761ABA2CEF",
    };

    // Configuración de la petición
    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    // Añadir body si no es GET
    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Hacer la petición a la API de Inmovilla
    const response = await fetch(targetUrl, fetchOptions);

    // Leer la respuesta
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Configurar headers CORS para todas las respuestas
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Token"
    );

    // Log para debugging
    console.log(`📥 API Response Status: ${response.status}`);
    if (Array.isArray(data)) {
      console.log(`📦 Data: Array with ${data.length} items`);
    } else if (typeof data === "object") {
      console.log(
        `📦 Data: Object with keys: ${Object.keys(data).slice(0, 5).join(", ")}`
      );
    }

    // Devolver la respuesta con el mismo status code
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ API Proxy Error:", error);

    // Configurar CORS incluso en errores
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Token"
    );

    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
