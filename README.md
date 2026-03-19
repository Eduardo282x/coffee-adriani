# ☕ Café Adriani — Sistema de Gestión para Empresa Distribuidora

> Aplicación web administrativa desarrollada a medida para una distribuidora de café, reemplazando su gestión manual en Excel por una plataforma centralizada que digitaliza productos, inventario, clientes, facturación, cobros y reportes.
 
🔗 **Backend:** [coffee-adriani-api](https://github.com/Eduardo282x/coffee-adriani-api)

---

## 📋 Descripción

Café Adriani es un sistema administrativo interno desarrollado para una distribuidora de café que llevaba sus operaciones comerciales en hojas de cálculo. La necesidad principal del cliente era poder agrupar y visualizar facturas por cliente, gestionar sus cobros pendientes y generar reportes consolidados por rango de fechas.
 
El sistema reemplaza completamente ese flujo manual con una plataforma web moderna, accesible para el personal interno de la empresa.
 
---
 
## ✨ Módulos del sistema
 
- 📦 **Productos e inventario** — Creación de productos y control de stock en tiempo real
- 👥 **Gestión de clientes** — Organización de clientes por zonas y bloques según la estructura de distribución
- 🧾 **Facturación** — Creación y administración de facturas con visualización agrupada por cliente
- 💳 **Pagos y conciliación** — Registro de pagos en módulo independiente; el sistema vincula cada pago a su factura una vez recibido el comprobante
- 📲 **Cobranza** — Vista de clientes con facturas pendientes y acceso directo a WhatsApp de cada cliente para enviar recordatorios de pago con un clic
- 📊 **Dashboard ejecutivo** — Panel con métricas del negocio: total de clientes, stock, demanda de productos, clientes con mayor volumen y últimas facturas
- 📁 **Reportes en Excel** — Exportación de reportes filtrados por rango de fechas
- 
---

## ✨ Funcionalidades principales

- 📦 **Gestión de productos** — Alta, edición y eliminación de ítems del menú con categorías y precios
- 🛒 **Gestión de pedidos** — Registro y seguimiento del estado de los pedidos
- 📊 **Panel administrativo** — Vista general de operaciones y métricas del negocio
- 📱 **Diseño responsive** — Interfaz adaptable a dispositivos móviles, tablets y escritorio
- 🎨 **UI moderna** — Componentes visuales limpios con Tailwind CSS y shadcn/ui

---

## 🛠️ Tecnologías utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Framework | React 18 |
| Lenguaje | TypeScript |
| Bundler | Vite |
| Estilos | Tailwind CSS |
| Componentes UI | shadcn/ui |
| Linting | ESLint |
| Despliegue | VPS |

---

## 🚀 Instalación y uso local

### Requisitos previos

- Node.js 18 o superior
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Eduardo282x/coffee-adriani.git
cd coffee-adriani

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar el archivo .env con tus valores

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
coffee-adriani/
├── public/               # Recursos estáticos (imágenes, íconos)
├── src/
│   ├── components/       # Componentes reutilizables de UI
│   ├── pages/            # Vistas principales de la aplicación
│   ├── hooks/            # Custom hooks de React
│   ├── services/         # Llamadas a APIs y lógica de datos
│   ├── types/            # Tipos e interfaces de TypeScript
│   └── App.tsx           # Componente raíz y configuración de rutas
├── .env                  # Variables de entorno (no subir al repo)
├── components.json       # Configuración de shadcn/ui
├── vercel.json           # Configuración de despliegue en Vercel
├── vite.config.ts        # Configuración de Vite
└── package.json          # Dependencias y scripts del proyecto
```

---

## ⚙️ Scripts disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo con HMR
npm run build     # Genera la build de producción en /dist
npm run preview   # Previsualiza la build de producción localmente
npm run lint      # Ejecuta ESLint para revisar el código
```

---

## 🌐 Despliegue en VPS (Contabo)

El proyecto está desplegado en un servidor VPS con **Ubuntu Linux** en Contabo, utilizando **Nginx** como servidor web y reverse proxy.

### Pasos para desplegar en producción

```bash
# 1. Generar la build de producción
npm run build

# 2. Copiar el contenido de /dist al servidor
scp -r dist/ usuario@ip-del-servidor:/var/www/coffee-adriani
```

### Configuración de Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/coffee-adriani;
    index index.html;

    # Necesario para el enrutamiento SPA de React
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Después de guardar la configuración, recargar Nginx:

```bash
sudo nginx -t          # Verificar configuración
sudo systemctl reload nginx
```

---

## 👤 Autor

**Eduardo Rojas**
- GitHub: [@Eduardo282x](https://github.com/Eduardo282x)
- Email: eduardorojas282x@gmail.com

---

## 📄 Licencia

Este proyecto es de uso privado. Todos los derechos reservados © Eduardo Rojas.
