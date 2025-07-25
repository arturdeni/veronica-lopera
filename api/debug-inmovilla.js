// api/debug-inmovilla.js
export default async function handler(req, res) {
  try {
    // Información de la petición
    const requestInfo = {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: req.headers,
      path: req.query.path,
    };

    // Probar la API de Inmovilla directamente
    const testUrl = "https://procesos.inmovilla.com/api/v1/enums/?tipos";

    console.log("Testing Inmovilla API:", testUrl);

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Token:
          process.env.INMOVILLA_TOKEN || "0F6399CF144116F22D567B761ABA2CEF",
      },
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    res.status(200).json({
      message: "Debug Inmovilla API",
      request: requestInfo,
      inmovilla: {
        testUrl,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        dataPreview:
          typeof responseData === "string"
            ? responseData.substring(0, 500) + "..."
            : responseData,
        dataType: typeof responseData,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasToken: !!process.env.INMOVILLA_TOKEN,
        tokenPreview: process.env.INMOVILLA_TOKEN
          ? process.env.INMOVILLA_TOKEN.substring(0, 8) + "..."
          : "No token",
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      error: "Debug failed",
      message: error.message,
      stack: error.stack,
    });
  }
}
