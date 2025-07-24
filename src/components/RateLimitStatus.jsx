// src/components/RateLimitStatus.jsx - ARCHIVO COMPLETO
import React from "react";
import { Clock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

/**
 * Componente para mostrar el estado de rate limits de la API
 * Útil para debugging y monitoreo
 */
const RateLimitStatus = ({ rateLimitStatus, onReload, className = "" }) => {
  if (!rateLimitStatus) return null;

  const formatTime = (ms) => {
    if (ms <= 0) return "Disponible";
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getStatusIcon = (canRequest, count, limit) => {
    if (!canRequest) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (count > limit * 0.7)
      return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusColor = (canRequest, count, limit) => {
    if (!canRequest) return "bg-red-50 border-red-200";
    if (count > limit * 0.7) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg border shadow-lg bg-white z-50 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-800">API Status</h3>
        <button
          onClick={onReload}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Recargar datos"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-2">
        {/* Status Enums */}
        <div
          className={`p-2 rounded border ${getStatusColor(
            rateLimitStatus.enums.canRequest,
            rateLimitStatus.enums.count,
            2
          )}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(
                rateLimitStatus.enums.canRequest,
                rateLimitStatus.enums.count,
                2
              )}
              <span className="text-xs font-medium">Enums</span>
            </div>
            <span className="text-xs text-gray-600">
              {rateLimitStatus.enums.count}/2
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Reset: {formatTime(rateLimitStatus.enums.resetIn)}
          </div>
        </div>

        {/* Status Properties */}
        <div
          className={`p-2 rounded border ${getStatusColor(
            rateLimitStatus.properties.canRequest,
            rateLimitStatus.properties.count,
            10
          )}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(
                rateLimitStatus.properties.canRequest,
                rateLimitStatus.properties.count,
                10
              )}
              <span className="text-xs font-medium">Properties</span>
            </div>
            <span className="text-xs text-gray-600">
              {rateLimitStatus.properties.count}/10
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Reset: {formatTime(rateLimitStatus.properties.resetIn)}
          </div>
        </div>
      </div>

      {/* Warning si estamos cerca del límite */}
      {(!rateLimitStatus.enums.canRequest ||
        !rateLimitStatus.properties.canRequest) && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-700">
              Rate limit alcanzado. Espera antes de hacer más peticiones.
            </span>
          </div>
        </div>
      )}

      {/* Consejos */}
      <div className="mt-3 text-xs text-gray-500">
        <div>
          💡 <strong>Tip:</strong> Los datos se cachean para reducir peticiones
        </div>
        <div className="mt-1">🔄 Reset automático cada minuto</div>
      </div>
    </div>
  );
};

export default RateLimitStatus;
