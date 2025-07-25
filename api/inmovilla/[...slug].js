// api/inmovilla/[...slug].js (nuevo nombre de archivo)
export default async function handler(req, res) {
  console.log("🔍 Dynamic route called");
  console.log("📋 Query:", req.query);
  console.log("📋 Slug:", req.query.slug);

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

  const { slug } = req.query;

  // Construir el path desde el slug
  let pathString = "";
  if (Array.isArray(slug)) {
    pathString = slug.join("/");
  } else if (slug) {
    pathString = slug;
  }

  console.log("🛤️ Constructed path:", pathString);

  // Construir la URL completa hacia la API de Inmovilla
  const baseUrl = "https://procesos.inmovilla.com/api/v1";
  let targetUrl = `${baseUrl}/${pathString}`;

  // Añadir query parameters (excluyendo 'slug' que es interno)
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach((key) => {
    if (key !== "slug") {
      queryParams.append(key, req.query[key]);
    }
  });

  if (queryParams.toString()) {
    targetUrl += `?${queryParams.toString()}`;
  }

  console.log(`🌐 Final URL: ${targetUrl}`);

  try {
    // Headers requeridos por la API de Inmovilla
    const headers = {
      "Content-Type": "application/json",
      Token: process.env.INMOVILLA_TOKEN || "0F6399CF144116F22D567B761ABA2CEF",
    };

    // Hacer la petición
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
    });

    console.log(`📥 Response status: ${response.status}`);

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
    console.error("❌ API Error:", error);

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
      targetUrl,
      slug: req.query.slug,
    });
  }
}
