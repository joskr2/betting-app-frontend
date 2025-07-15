/**
 * Enhanced Error Handler with Toast Integration
 * Provides centralized error handling with user-friendly toast notifications
 */

import { toast } from "@/hooks/use-toast";
import type { ApiError } from "@/types/api";

export type ErrorLevel = "info" | "warning" | "error" | "success";

export interface ErrorContext {
  operation?: string;
  userId?: string;
  details?: Record<string, unknown>;
}

export interface ToastConfig {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
}

/**
 * Enhanced error handler that provides user-friendly error messages and toast notifications
 */
export namespace ErrorHandler {
  const errorMap: Record<number, ToastConfig> = {
    // Authentication errors
    401: {
      title: "Sesión expirada",
      description: "Por favor, inicia sesión nuevamente",
      variant: "destructive",
      duration: 5000,
    },
    403: {
      title: "Acceso denegado",
      description: "No tienes permisos para realizar esta acción",
      variant: "destructive",
      duration: 5000,
    },
    
    // Client errors
    400: {
      title: "Datos inválidos",
      description: "Por favor, verifica los datos ingresados",
      variant: "destructive",
      duration: 4000,
    },
    404: {
      title: "No encontrado",
      description: "El recurso solicitado no existe",
      variant: "destructive",
      duration: 4000,
    },
    409: {
      title: "Conflicto",
      description: "Ya existe un recurso con estos datos",
      variant: "destructive",
      duration: 4000,
    },
    422: {
      title: "Datos incorrectos",
      description: "Los datos enviados no son válidos",
      variant: "destructive",
      duration: 4000,
    },
    
    // Server errors
    500: {
      title: "Error del servidor",
      description: "Ocurrió un error interno. Intenta nuevamente",
      variant: "destructive",
      duration: 6000,
    },
    502: {
      title: "Servicio no disponible",
      description: "El servicio está temporalmente no disponible",
      variant: "destructive",
      duration: 6000,
    },
    503: {
      title: "Mantenimiento",
      description: "El sistema está en mantenimiento",
      variant: "destructive",
      duration: 6000,
    },
    504: {
      title: "Tiempo agotado",
      description: "La solicitud tardó demasiado en responder",
      variant: "destructive",
      duration: 6000,
    },
  };

  const operationMessages: Record<string, Record<ErrorLevel, ToastConfig>> = {
    login: {
      error: {
        title: "Error de inicio de sesión",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
        duration: 5000,
      },
      success: {
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
        variant: "default",
        duration: 3000,
      },
      info: {
        title: "Iniciando sesión...",
        description: "Verificando credenciales",
        variant: "default",
        duration: 2000,
      },
      warning: {
        title: "Advertencia",
        description: "Verifica tu conexión a internet",
        variant: "destructive",
        duration: 4000,
      },
    },
    
    register: {
      error: {
        title: "Error de registro",
        description: "No se pudo crear la cuenta",
        variant: "destructive",
        duration: 5000,
      },
      success: {
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente",
        variant: "default",
        duration: 3000,
      },
      info: {
        title: "Creando cuenta...",
        description: "Procesando tu registro",
        variant: "default",
        duration: 2000,
      },
      warning: {
        title: "Email en uso",
        description: "Este email ya está registrado",
        variant: "destructive",
        duration: 4000,
      },
    },
    
    bet: {
      error: {
        title: "Error en apuesta",
        description: "No se pudo procesar tu apuesta",
        variant: "destructive",
        duration: 5000,
      },
      success: {
        title: "¡Apuesta realizada!",
        description: "Tu apuesta ha sido procesada correctamente",
        variant: "default",
        duration: 4000,
      },
      info: {
        title: "Procesando apuesta...",
        description: "Validando información",
        variant: "default",
        duration: 2000,
      },
      warning: {
        title: "Saldo insuficiente",
        description: "No tienes suficiente saldo para esta apuesta",
        variant: "destructive",
        duration: 4000,
      },
    },
    
    profile: {
      error: {
        title: "Error de perfil",
        description: "No se pudo cargar tu información",
        variant: "destructive",
        duration: 4000,
      },
      success: {
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados",
        variant: "default",
        duration: 3000,
      },
      info: {
        title: "Cargando perfil...",
        description: "Obteniendo tu información",
        variant: "default",
        duration: 2000,
      },
      warning: {
        title: "Sesión caducada",
        description: "Por favor, inicia sesión nuevamente",
        variant: "destructive",
        duration: 5000,
      },
    },
    
    network: {
      error: {
        title: "Error de conexión",
        description: "Verifica tu conexión a internet",
        variant: "destructive",
        duration: 6000,
      },
      warning: {
        title: "Conexión lenta",
        description: "La conexión está tardando más de lo normal",
        variant: "destructive",
        duration: 4000,
      },
      info: {
        title: "Reconectando...",
        description: "Intentando reconectar al servidor",
        variant: "default",
        duration: 3000,
      },
      success: {
        title: "Conectado",
        description: "La conexión ha sido restablecida",
        variant: "default",
        duration: 2000,
      },
    },
  };

  /**
   * Handle API errors with appropriate toast notifications
   */
  export function handleApiError(error: ApiError | Error, context?: ErrorContext): void {
    console.error("🚨 API Error:", error, context);
    
    // Handle network errors
    if (error instanceof TypeError || (error as Error & { networkError?: boolean }).networkError) {
      showOperationToast("network", "error", context);
      return;
    }
    
    const apiError = error as ApiError;
    const status = apiError.status;
    
    // Use specific error mapping if available
    if (status && errorMap[status]) {
      const config = errorMap[status];
      showToast(config);
      return;
    }
    
    // Use operation-specific error if available
    if (context?.operation && operationMessages[context.operation]) {
      showOperationToast(context.operation, "error", context);
      return;
    }
    
    // Fallback generic error
    showToast({
      title: "Error inesperado",
      description: apiError.message || "Ocurrió un error. Intenta nuevamente",
      variant: "destructive",
      duration: 5000,
    });
  }

  /**
   * Show operation-specific toast
   */
  export function showOperationToast(
    operation: string,
    level: ErrorLevel,
    context?: ErrorContext
  ): void {
    const operationConfig = operationMessages[operation];
    if (!operationConfig || !operationConfig[level]) {
      console.warn(`No toast config found for operation: ${operation}, level: ${level}`);
      return;
    }
    
    const config = operationConfig[level];
    showToast(config, context);
  }

  /**
   * Show custom toast with enhanced context
   */
  export function showToast(config: ToastConfig, context?: ErrorContext): void {
    toast({
      title: config.title,
      description: config.description,
      variant: config.variant || "default",
      duration: config.duration || 4000,
    });
    
    // Log for debugging
    console.log(`📢 Toast: ${config.title} - ${config.description}`, context);
  }

  /**
   * Show success message
   */
  export function showSuccess(message: string, title = "¡Éxito!"): void {
    showToast({
      title,
      description: message,
      variant: "default",
      duration: 3000,
    });
  }

  /**
   * Show info message
   */
  export function showInfo(message: string, title = "Información"): void {
    showToast({
      title,
      description: message,
      variant: "default",
      duration: 3000,
    });
  }

  /**
   * Show warning message
   */
  export function showWarning(message: string, title = "Advertencia"): void {
    showToast({
      title,
      description: message,
      variant: "destructive",
      duration: 4000,
    });
  }

  /**
   * Show error message
   */
  export function showError(message: string, title = "Error"): void {
    showToast({
      title,
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  }

  /**
   * Check if BFF is responding correctly (returns proper API structure)
   */
  export function isBffMockResponse(response: unknown): boolean {
    if (!response || typeof response !== "object" || response === null) {
      return false;
    }
    
    const obj = response as Record<string, unknown>;
    
    return (
      "name" in obj &&
      "version" in obj &&
      obj.name === "Sports Betting BFF" &&
      obj.version === "1.0.0" &&
      !("data" in obj && obj.data) &&
      !("success" in obj && obj.success)
    );
  }

  /**
   * Handle BFF mock response with appropriate messaging
   */
  export function handleBffMockResponse(operation: string): void {
    showToast({
      title: "Modo de desarrollo",
      description: "La API está en modo de prueba. Algunas funciones están limitadas.",
      variant: "destructive",
      duration: 6000,
    });
    
    console.warn("🔧 BFF returning mock response for operation:", operation);
  }
}

/**
 * React Hook for enhanced error handling
 */
export function useErrorHandler() {
  const handleError = (error: ApiError | Error, context?: ErrorContext) => {
    ErrorHandler.handleApiError(error, context);
  };

  const showSuccess = (message: string, title?: string) => {
    ErrorHandler.showSuccess(message, title);
  };

  const showInfo = (message: string, title?: string) => {
    ErrorHandler.showInfo(message, title);
  };

  const showWarning = (message: string, title?: string) => {
    ErrorHandler.showWarning(message, title);
  };

  const showError = (message: string, title?: string) => {
    ErrorHandler.showError(message, title);
  };

  const showOperationToast = (operation: string, level: ErrorLevel, context?: ErrorContext) => {
    ErrorHandler.showOperationToast(operation, level, context);
  };

  return {
    handleError,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showOperationToast,
  };
}