# 🏆 Sport Betting App

Una moderna plataforma de apuestas deportivas construida con tecnologías de vanguardia para ofrecer una experiencia de usuario excepcional y segura.

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React Query](https://img.shields.io/badge/React%20Query-5.0-red?style=for-the-badge&logo=react-query)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Características Principales

- 🎯 **Apuestas en Tiempo Real** - Sistema completo de gestión de apuestas deportivas
- 🔐 **Autenticación Segura** - JWT tokens con gestión automática de sesiones
- 📱 **Diseño Responsivo** - Optimizado para desktop, tablet y móvil
- ⚡ **Rendimiento Optimizado** - SSR/SSG con Next.js y cache inteligente
- 🎨 **UI Moderna** - Componentes elegantes con shadcn/ui y Tailwind CSS
- 📊 **Dashboard Completo** - Estadísticas detalladas y historial de apuestas
- 🔄 **Actualizaciones en Vivo** - Datos en tiempo real con React Query

## 🛠️ Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React con SSR/SSG
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para mayor robustez
- **[React Query](https://tanstack.com/query)** - Gestión de estado del servidor y cache
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos y accesibles

### Backend Integration
- **BFF Architecture** - Backend for Frontend con API REST
- **JWT Authentication** - Autenticación basada en tokens
- **Real-time Updates** - Sincronización automática de datos

## 🚀 Despliegue en Vercel

La aplicación está optimizada para un despliegue sin complicaciones en **Vercel**, aprovechando al máximo las capacidades de la plataforma:

### Características del Despliegue

- ⚡ **Edge Functions** - Rendimiento global óptimo
- 🔄 **Automatic Deployments** - CI/CD automático desde Git
- 📈 **Analytics Integrado** - Monitoreo de rendimiento en tiempo real
- 🌍 **Global CDN** - Distribución mundial para máxima velocidad
- 🔒 **Environment Variables** - Gestión segura de configuración

### Deploy Automático

```bash
# Conecta tu repositorio a Vercel
vercel --prod

# Variables de entorno requeridas:
# NEXT_PUBLIC_API_BASE_URL=your-bff-api-url
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sport-betting-app)

## 🏗️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18.17 o superior
- npm o yarn

### Configuración Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd sport-betting-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu configuración

# Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://your-bff-api-url
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npm run type-check   # Verificación de tipos TypeScript
```

## 🏛️ Arquitectura

### Estructura de Carpetas

```
sport-betting-app/
├── app/                 # App Router (Next.js 13+)
│   ├── (auth)/         # Grupo de rutas de autenticación
│   ├── bets/           # Gestión de apuestas
│   └── profile/        # Perfil de usuario
├── components/         # Componentes reutilizables
│   └── ui/            # Componentes base (shadcn/ui)
├── hooks/             # Custom hooks para API
├── lib/               # Utilidades y configuración
├── types/             # Definiciones TypeScript
└── styles/            # Estilos globales
```

### Flujo de Datos

1. **Frontend** → React Query hooks
2. **API Client** → HTTP requests con autenticación
3. **BFF** → Backend for Frontend
4. **Cache** → Gestión inteligente con React Query

## 🔧 Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Gestión automática de tokens
- ✅ Rutas protegidas

### Apuestas
- ✅ Visualización de eventos deportivos
- ✅ Colocación de apuestas
- ✅ Vista previa antes de confirmar
- ✅ Historial y estadísticas
- ✅ Cancelación de apuestas

### Dashboard
- ✅ Resumen de actividad
- ✅ Estadísticas personalizadas
- ✅ Eventos populares
- ✅ Balance y transacciones

## 🎨 Diseño UI/UX

- **Dark/Light Mode** - Soporte para temas
- **Responsive Design** - Adaptable a cualquier dispositivo
- **Micro-interactions** - Animaciones fluidas
- **Accessibility** - Cumple con estándares WCAG
- **Loading States** - Feedback visual constante

## 📊 Optimizaciones de Rendimiento

- ⚡ **Code Splitting** automático con Next.js
- 🗄️ **Cache Strategy** inteligente con React Query
- 🖼️ **Image Optimization** automática
- 📝 **Bundle Analysis** para código optimizado
- 🔄 **Incremental Static Regeneration** (ISR)

## 🔒 Seguridad

- 🛡️ **JWT Tokens** con expiración automática
- 🔐 **HTTPS Only** en producción
- 🚫 **XSS Protection** integrada
- 📝 **Input Validation** en frontend y backend
- 🔒 **Environment Variables** para datos sensibles

## 📱 Progressive Web App

La aplicación incluye características PWA:
- 📱 **Install Prompt** - Instalable como app nativa
- 🔄 **Service Worker** - Cache offline
- 📳 **Push Notifications** - Notificaciones en tiempo real
- 🎯 **App Manifest** - Configuración nativa

