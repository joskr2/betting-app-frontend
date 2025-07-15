"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useErrorHandler } from "@/lib/error-handler";
import { apiClient } from "@/lib/api-client";
import { CheckCircle, XCircle, AlertCircle, Play, Wifi, WifiOff } from "lucide-react";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  details?: string;
}

export function IntegrationTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Conectividad BFF", status: "pending", message: "No ejecutado" },
    { name: "Health Check", status: "pending", message: "No ejecutado" },
    { name: "Test de Registro", status: "pending", message: "No ejecutado" },
    { name: "Test de Login", status: "pending", message: "No ejecutado" },
    { name: "Test de Eventos", status: "pending", message: "No ejecutado" },
    { name: "Test de Apuestas", status: "pending", message: "No ejecutado" },
    { name: "Sistema de Toasts", status: "pending", message: "No ejecutado" },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const { showSuccess, showError, showInfo, showWarning } = useErrorHandler();

  const updateTest = (index: number, update: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...update } : test));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    try {
      // Test 1: Conectividad BFF
      updateTest(0, { status: "running", message: "Probando conexión..." });
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL!);
        if (response.ok) {
          updateTest(0, { status: "success", message: "BFF accesible" });
        } else {
          updateTest(0, { status: "error", message: `HTTP ${response.status}` });
        }
      } catch (error) {
        updateTest(0, { status: "error", message: "Error de conexión", details: (error as Error).message });
      }

      // Test 2: Health Check
      updateTest(1, { status: "running", message: "Verificando salud del sistema..." });
      try {
        const response = await apiClient.get("/health");
        updateTest(1, { status: "success", message: "Sistema operacional" });
      } catch (error) {
        updateTest(1, { status: "error", message: "Sistema no disponible", details: (error as Error).message });
      }

      // Test 3: Test de Registro (mock)
      updateTest(2, { status: "running", message: "Probando registro..." });
      try {
        const response = await apiClient.post("/api/auth/register", {
          email: `test_${Date.now()}@example.com`,
          password: "test123",
          full_name: "Test User"
        });
        
        if (response && typeof response === 'object' && 'name' in response && response.name === "Sports Betting BFF") {
          updateTest(2, { status: "error", message: "BFF en modo mock", details: "La API está devolviendo respuestas de prueba" });
        } else {
          updateTest(2, { status: "success", message: "Registro funcional" });
        }
      } catch (error) {
        updateTest(2, { status: "error", message: "Error en registro", details: (error as Error).message });
      }

      // Test 4: Test de Login (mock)
      updateTest(3, { status: "running", message: "Probando login..." });
      try {
        const response = await apiClient.post("/api/auth/login", {
          email: "test@example.com",
          password: "test123"
        });
        
        if (response && typeof response === 'object' && 'name' in response && response.name === "Sports Betting BFF") {
          updateTest(3, { status: "error", message: "BFF en modo mock", details: "La API está devolviendo respuestas de prueba" });
        } else {
          updateTest(3, { status: "success", message: "Login funcional" });
        }
      } catch (error) {
        updateTest(3, { status: "error", message: "Error en login", details: (error as Error).message });
      }

      // Test 5: Test de Eventos
      updateTest(4, { status: "running", message: "Obteniendo eventos..." });
      try {
        const response = await apiClient.get("/api/events");
        
        if (response && typeof response === 'object' && 'name' in response && response.name === "Sports Betting BFF") {
          updateTest(4, { status: "error", message: "BFF en modo mock", details: "La API está devolviendo respuestas de prueba" });
        } else {
          updateTest(4, { status: "success", message: "Eventos disponibles" });
        }
      } catch (error) {
        updateTest(4, { status: "error", message: "Error obteniendo eventos", details: (error as Error).message });
      }

      // Test 6: Test de Apuestas (requiere auth)
      updateTest(5, { status: "running", message: "Probando sistema de apuestas..." });
      try {
        const response = await apiClient.get("/api/bets/my-bets");
        
        if (response && typeof response === 'object' && 'name' in response && response.name === "Sports Betting BFF") {
          updateTest(5, { status: "error", message: "BFF en modo mock", details: "La API está devolviendo respuestas de prueba" });
        } else {
          updateTest(5, { status: "success", message: "Sistema de apuestas funcional" });
        }
      } catch (error) {
        updateTest(5, { status: "error", message: "Error en apuestas", details: (error as Error).message });
      }

      // Test 7: Sistema de Toasts
      updateTest(6, { status: "running", message: "Probando notificaciones..." });
      try {
        showInfo("Test de notificación informativa");
        await new Promise(resolve => setTimeout(resolve, 1000));
        showSuccess("Test de notificación de éxito");
        await new Promise(resolve => setTimeout(resolve, 1000));
        showWarning("Test de notificación de advertencia");
        await new Promise(resolve => setTimeout(resolve, 1000));
        showError("Test de notificación de error");
        
        updateTest(6, { status: "success", message: "Sistema de toasts funcional" });
      } catch (error) {
        updateTest(6, { status: "error", message: "Error en toasts", details: (error as Error).message });
      }

    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Éxito</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "running":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Ejecutando</Badge>;
      default:
        return <Badge variant="outline">Pendiente</Badge>;
    }
  };

  const successCount = tests.filter(t => t.status === "success").length;
  const errorCount = tests.filter(t => t.status === "error").length;
  const totalTests = tests.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {process.env.NEXT_PUBLIC_API_BASE_URL ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <div>
              <CardTitle>Test de Integración BFF</CardTitle>
              <CardDescription>
                Verificación de la conectividad y funcionalidad del Backend for Frontend
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Ejecutando..." : "Ejecutar Tests"}
          </Button>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Éxito: {successCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Error: {errorCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Total: {totalTests}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.message}</div>
                  {test.details && (
                    <div className="text-xs text-gray-500 mt-1">{test.details}</div>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Configuración BFF:</h4>
          <div className="text-sm text-gray-600">
            <div>Endpoint: <code className="bg-gray-200 px-1 rounded">{process.env.NEXT_PUBLIC_API_BASE_URL || 'No configurado'}</code></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}