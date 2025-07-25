// api/inmovilla/enums.js
export default async function handler(req, res) {
  console.log("🔍 Enums route called");
  console.log("📋 Query:", req.query);
  console.log("📋 URL:", req.url);

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

  try {
    // Construir la URL hacia la API de Inmovilla
    const baseUrl = "https://procesos.inmovilla.com/api/v1/enums/";
    const queryParams = new URLSearchParams();

    // Copiar todos los query parameters
    Object.keys(req.query).forEach((key) => {
      queryParams.append(key, req.query[key]);
      console.log(`🔗 Adding query param: ${key}=${req.query[key]}`);
    });

    const targetUrl = `${baseUrl}?${queryParams.toString()}`;
    console.log(`🌐 Target URL: ${targetUrl}`);

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

    // Leer la respuesta
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Configurar headers CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Token"
    );

    // Devolver la respuesta
    res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Enums API Error:", error);

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
