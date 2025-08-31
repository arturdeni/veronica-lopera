// src/config/env.js
// Configuración centralizada de variables de entorno para React/Vite

/**
 * Configuración de Inmovilla API Web
 * En Vite, las variables de entorno se acceden con import.meta.env
 */
export const INMOVILLA_CONFIG = {
  // API Web Inmovilla
  numagencia: import.meta.env.VITE_INMOVILLA_AGENCY || "12093",
  password: import.meta.env.VITE_INMOVILLA_PASSWORD || "DH4#Sk*uM",
  addnumagencia: import.meta.env.VITE_INMOVILLA_USER_SUFFIX || "_244_ext",
  idioma: parseInt(import.meta.env.VITE_INMOVILLA_LANGUAGE || "1"),

  // API REST Inmovilla (para fallback)
  token:
    import.meta.env.VITE_INMOVILLA_TOKEN || "0F6399CF144116F22D567B761ABA2CEF",
};

/**
 * Validar configuración
 */
export const validateInmovillaConfig = () => {
  const errors = [];

  if (!INMOVILLA_CONFIG.numagencia) {
    errors.push("Missing VITE_INMOVILLA_AGENCY");
  }

  if (!INMOVILLA_CONFIG.password) {
    errors.push("Missing VITE_INMOVILLA_PASSWORD");
  }

  if (errors.length > 0) {
    console.error("❌ Inmovilla configuration errors:", errors);
    console.error(
      "💡 Make sure your .env.local has the correct variables with VITE_ prefix"
    );
    return false;
  }

  console.log("✅ Inmovilla configuration validated:", {
    numagencia: INMOVILLA_CONFIG.numagencia,
    hasPassword: !!INMOVILLA_CONFIG.password,
    addnumagencia: INMOVILLA_CONFIG.addnumagencia,
    idioma: INMOVILLA_CONFIG.idioma,
  });

  return true;
};

/**
 * Información de debugging
 */
export const getConfigDebugInfo = () => {
  return {
    // Mostrar todas las variables de entorno disponibles (filtradas)
    availableEnvVars: Object.keys(import.meta.env).filter((key) =>
      key.startsWith("VITE_INMOVILLA_")
    ),

    // Configuración actual
    config: {
      numagencia: INMOVILLA_CONFIG.numagencia,
      hasPassword: !!INMOVILLA_CONFIG.password,
      addnumagencia: INMOVILLA_CONFIG.addnumagencia,
      idioma: INMOVILLA_CONFIG.idioma,
      hasToken: !!INMOVILLA_CONFIG.token,
    },

    // Variables raw (para debugging)
    rawEnv: {
      VITE_INMOVILLA_AGENCY: import.meta.env.VITE_INMOVILLA_AGENCY,
      VITE_INMOVILLA_PASSWORD: import.meta.env.VITE_INMOVILLA_PASSWORD
        ? "***"
        : undefined,
      VITE_INMOVILLA_USER_SUFFIX: import.meta.env.VITE_INMOVILLA_USER_SUFFIX,
      VITE_INMOVILLA_LANGUAGE: import.meta.env.VITE_INMOVILLA_LANGUAGE,
      VITE_INMOVILLA_TOKEN: import.meta.env.VITE_INMOVILLA_TOKEN
        ? "***"
        : undefined,
    },
  };
};
