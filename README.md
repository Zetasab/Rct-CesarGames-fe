<div align="center">

<h1>
  <font color="#ff4200"><b>CesarSob</b></font>
  <font color="#ededed"><b> Games</b></font>
</h1>

<p>Por si quieres ver → <a href="https://games.cesarsobrino.es"><strong>Live Demo</strong></a></p>

![video-project](Video-Project.gif)

</div>

---

## 📋 Descripción

**CesarSob Games** es una aplicación web de catálogo de videojuegos de prueba desarrollada con tecnologías modernas. Permite explorar juegos, buscarlos por género, plataforma o tienda, ver detalles de cada título, guardar tus juegos favoritos y gestionar una cuenta de usuario con autenticación completa.

El frontend se comunica con un API Gateway propio alojado en Railway, que actúa de intermediario con servicios externos de datos de videojuegos.

---

## 🛠️ Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Lenguaje | [TypeScript 5](https://www.typescriptlang.org/) |
| UI Library | [React 19](https://react.dev/) |
| Componentes | [PrimeReact 10](https://primereact.org/) + [PrimeIcons](https://primereact.org/icons/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Botones animados | [react-ladda-button](https://www.npmjs.com/package/react-ladda-button) |
| Contenerización | [Docker](https://www.docker.com/) + [Nginx](https://nginx.org/) |
| Linting | [ESLint 9](https://eslint.org/) |

---

## 🗂️ Estructura del proyecto

```
├── app/                        # Rutas y páginas (Next.js App Router)
│   ├── page.tsx                # Página principal (Home)
│   ├── layout.tsx              # Layout global
│   ├── globals.css             # Estilos globales y variables de color
│   ├── game/[slug]/            # Detalle de un juego
│   ├── search/                 # Búsqueda general
│   ├── searchGenres/           # Búsqueda por género
│   ├── searchPlatforms/        # Búsqueda por plataforma
│   ├── searchStores/           # Búsqueda por tienda
│   ├── mygames/                # Juegos guardados del usuario
│   ├── login/                  # Inicio de sesión
│   ├── register/               # Registro de usuario
│   ├── forgot-password/        # Recuperación de contraseña
│   └── legal/                  # Página legal
│
├── components/                 # Componentes reutilizables
│   ├── AuthGuard.tsx           # Protección de rutas autenticadas
│   ├── ClientProviders.tsx     # Proveedores globales de cliente
│   ├── game-carousel/          # Carrusel de juegos
│   └── hero-header/            # Cabecera hero de la home
│
├── features/                   # Lógica de negocio por sección
│   ├── home/                   # Vista principal con carruseles
│   ├── detailed-game/          # Vista de detalle de juego
│   ├── search/                 # Resultados de búsqueda
│   ├── search-genres/          # Resultados por género
│   ├── search-platforms/       # Resultados por plataforma
│   ├── search-stores/          # Resultados por tienda
│   ├── mygames/                # Sección de mis juegos
│   └── login/                  # Formulario de login
│
├── context/                    # Contextos de React
│   └── AuthContext.tsx         # Estado global de autenticación
│
├── services/                   # Servicios y llamadas a la API
│   ├── config.ts               # URL base por entorno
│   ├── AuthService.ts          # Autenticación (login, registro, etc.)
│   ├── GameService.ts          # Obtención de juegos
│   ├── GameResultService.ts    # Resultados de búsquedas
│   └── InfoService.ts          # Géneros, plataformas y tiendas
│
├── models/                     # Tipos e interfaces TypeScript
├── shared/                     # Navbar y Footer compartidos
├── public/                     # Recursos estáticos
├── Dockerfile                  # Imagen Docker de producción
└── nginx.conf                  # Configuración del servidor Nginx
```

---

## 🚀 Cómo iniciar el proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Instalación y arranque en desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Otros comandos disponibles

```bash
# Modo desarrollo con Turbopack (más rápido)
npm run dev:turbo

# Compilar para producción
npm run build

# Iniciar en modo producción (requiere build previo)
npm start

# Ejecutar el linter
npm run lint
```
