// api/inmovilla/[...path].js
export default async function handler(req, res) {
  console.log("🔍 Dynamic route called with path");
  console.log("📋 Full request query:", JSON.stringify(req.query, null, 2));
  console.log("📋 Path value:", req.query.path);
  console.log("📋 Request URL:", req.url);

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
    console.log("📂 Path is array:", path, "-> joined:", pathString);
  } else if (path) {
    pathString = path;
    console.log("📄 Path is string:", pathString);
  } else {
    console.log("❌ No path found in query");
    return res.status(400).json({
      error: "No path provided",
      query: req.query,
      url: req.url,
    });
  }

  // Construir la URL completa hacia la API de Inmovilla
  const baseUrl = "https://procesos.inmovilla.com/api/v1";
  let targetUrl = `${baseUrl}/${pathString}`;

  // Añadir query parameters (excluyendo 'path' que es interno de Next.js)
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach((key) => {
    if (key !== "path") {
      queryParams.append(key, req.query[key]);
      console.log(`🔗 Adding query param: ${key}=${req.query[key]}`);
    }
  });

  if (queryParams.toString()) {
    targetUrl += `?${queryParams.toString()}`;
  }

  console.log(`🌐 Final target URL: ${targetUrl}`);

  try {
    // Headers requeridos por la API de Inmovilla
    const headers = {
      "Content-Type": "application/json",
      Token: process.env.INMOVILLA_TOKEN || "0F6399CF144116F22D567B761ABA2CEF",
    };

    console.log(`🔑 Using token: ${headers.Token.substring(0, 8)}...`);

    // Hacer la petición a la API de Inmovilla
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
    });

    console.log(`📥 Inmovilla API Response Status: ${response.status}`);
    console.log(
      `📥 Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    // Leer la respuesta
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log(`📦 JSON data received, type: ${typeof data}`);
    } else {
      data = await response.text();
      console.log(`📄 Text data received, length: ${data.length}`);
      console.log(`📄 First 200 chars:`, data.substring(0, 200));
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

    // Log adicional para debugging
    if (Array.isArray(data)) {
      console.log(`📦 Final data: Array with ${data.length} items`);
    } else if (typeof data === "object") {
      console.log(
        `📦 Final data: Object with keys: ${Object.keys(data)
          .slice(0, 5)
          .join(", ")}`
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
      targetUrl: targetUrl,
      originalPath: req.query.path,
      originalQuery: req.query,
    });
  }
}
