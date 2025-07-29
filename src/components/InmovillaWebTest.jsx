import React, { useState } from "react";

const InmovillaWebTest = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState({
    numagencia: "",
    password: "",
    addnumagencia: "",
    idioma: 1,
  });

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("🔄 Testing API connection with credentials:", {
        numagencia: credentials.numagencia,
        hasPassword: !!credentials.password,
        addnumagencia: credentials.addnumagencia,
        idioma: credentials.idioma,
      });

      const testData = {
        numagencia: credentials.numagencia,
        addnumagencia: credentials.addnumagencia || "",
        password: credentials.password,
        idioma: parseInt(credentials.idioma),
        procesos: [
          {
            tipo: "tipos",
            posinicial: 1,
            numelementos: 10,
            where: "",
            orden: "",
          },
        ],
        json: true,
      };

      const response = await fetch("/api/inmovilla-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      setResponse(data);
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testPropertyList = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const testData = {
        numagencia: credentials.numagencia,
        addnumagencia: credentials.addnumagencia || "",
        password: credentials.password,
        idioma: parseInt(credentials.idioma),
        procesos: [
          {
            tipo: "paginacion",
            posinicial: 1,
            numelementos: 5,
            where: "",
            orden: "fechaact desc",
          },
        ],
        json: true,
      };

      const response = await fetch("/api/inmovilla-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCities = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const testData = {
        numagencia: credentials.numagencia,
        addnumagencia: credentials.addnumagencia || "",
        password: credentials.password,
        idioma: parseInt(credentials.idioma),
        procesos: [
          {
            tipo: "ciudades",
            posinicial: 1,
            numelementos: 20,
            where: "",
            orden: "",
          },
        ],
        json: true,
      };

      const response = await fetch("/api/inmovilla-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">
          🧪 Test API Web Inmovilla
        </h1>

        {/* Configuración de credenciales */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-medium">Credenciales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Agencia
              </label>
              <input
                type="text"
                name="numagencia"
                value={credentials.numagencia}
                onChange={handleCredentialChange}
                placeholder="Ej: 1234"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                placeholder="Tu password de API"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Usuario Adicional (opcional)
              </label>
              <input
                type="text"
                name="addnumagencia"
                value={credentials.addnumagencia}
                onChange={handleCredentialChange}
                placeholder="Ej: _000_ext"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Idioma</label>
              <select
                name="idioma"
                value={credentials.idioma}
                onChange={handleCredentialChange}
                className="w-full p-2 border rounded"
              >
                <option value={1}>Español</option>
                <option value={2}>Inglés</option>
                <option value={3}>Alemán</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-medium">Pruebas</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testApiConnection}
              disabled={
                loading || !credentials.numagencia || !credentials.password
              }
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "⏳ Probando..." : "🔧 Test Tipos de Propiedad"}
            </button>
            <button
              onClick={testCities}
              disabled={
                loading || !credentials.numagencia || !credentials.password
              }
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "⏳ Probando..." : "🏙️ Test Ciudades"}
            </button>
            <button
              onClick={testPropertyList}
              disabled={
                loading || !credentials.numagencia || !credentials.password
              }
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "⏳ Probando..." : "🏠 Test Propiedades"}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <h3 className="text-red-800 font-medium">❌ Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="text-green-800 font-medium mb-2">
              ✅ Respuesta de la API
            </h3>
            <div className="bg-white p-4 rounded border">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-blue-800 font-medium mb-2">ℹ️ Información</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>
              • Asegúrate de tener las credenciales correctas de la API Web de
              Inmovilla
            </li>
            <li>
              • El endpoint está disponible en: <code>/api/inmovilla-web</code>
            </li>
            <li>• Revisa la consola del navegador para logs detallados</li>
            <li>
              • Si tienes problemas, verifica tu configuración de red y proxy
            </li>
          </ul>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-gray-800 font-medium mb-2">🔗 Enlaces útiles</h3>
          <div className="space-y-1 text-sm">
            <a
              href="https://procesos.apinmo.com/apiweb/doc/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              📚 Documentación API Web Inmovilla
            </a>
            <a
              href="/api/test"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block"
            >
              🔧 Test de API de Vercel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InmovillaWebTest;
