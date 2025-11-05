# Grupo Geez Europa - Web de Reformas Integrales

## 📋 Descripción

Sitio web corporativo para **Grupo Geez Europa**, empresa especializada en **reformas integrales y construcción**. La web presenta servicios de reforma de viviendas, cocinas, baños, oficinas y locales comerciales, con un enfoque en acabados premium, planificación precisa y garantía por escrito.

## 🎯 Propósito

La web está diseñada para:
- **Captar leads** mediante formularios de contacto y solicitud de presupuestos
- **Mostrar portfolio** de proyectos realizados con casos de estudio
- **Informar** sobre servicios, procesos y áreas de trabajo
- **Generar confianza** con testimonios, garantías y transparencia
- **Facilitar contacto** mediante WhatsApp, formularios y llamadas directas
- **Calcular estimaciones** con calculadora orientativa de presupuestos

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS, diseño responsive y tema claro/oscuro
- **JavaScript (Vanilla)** - Interactividad sin dependencias
- **Firebase Firestore** (opcional) - Base de datos para almacenar solicitudes de presupuestos
- **LocalStorage** - Fallback para guardar datos localmente

## 📁 Estructura del Proyecto

```
grupo-geez-europa-static/
├── index.html              # Página principal
├── styles.css              # Estilos globales
├── app.js                  # Lógica JavaScript principal
├── db-config.js           # Configuración de base de datos (Firestore)
├── sitemap.xml            # Mapa del sitio para SEO
├── robots.txt             # Directivas para buscadores
├── servicios/             # Páginas de servicios individuales
│   ├── banos.html
│   ├── cocinas.html
│   ├── vivienda.html
│   ├── electricidad.html
│   ├── carpinteria.html
│   └── locales-oficinas.html
├── privacidad.html        # Política de privacidad
├── cookies.html           # Política de cookies
└── legal.html             # Aviso legal
```

## 🎨 Características Principales

### Diseño
- **Diseño responsive** - Adaptado para móvil, tablet y desktop
- **Tema claro/oscuro** - Toggle manual de tema
- **Paleta morado** - Color corporativo (#6b21a8) consistente en toda la web
- **Animaciones suaves** - Microinteracciones y transiciones
- **Cursor personalizado** - Solo en desktop (desactivado en móviles)

### Funcionalidades

1. **Formulario de contacto**
   - Guarda solicitudes en Firestore o localStorage
   - Pre-llena mensaje de WhatsApp automáticamente
   - Genera enlace compartible del presupuesto
   - Validación de campos obligatorios
   - Campos: Nombre, Teléfono, Email, Tipo de estancia, Rango de presupuesto, Metros cuadrados, Mensaje

2. **Calculadora de presupuestos**
   - Estimación orientativa por tipo de estancia
   - Variables: metros cuadrados, calidad (estándar/premium/lujo)
   - Cálculo en tiempo real
   - Resultado formateado en euros

3. **Slider Antes/Después**
   - Comparador interactivo de transformaciones
   - Control deslizante para ver cambios

4. **Secciones informativas**
   - Servicios principales (6 servicios con páginas dedicadas)
   - Áreas de trabajo (6 tipos de espacios)
   - Proceso de trabajo (4 pasos)
   - Casos de estudio (3 proyectos destacados)
   - Galería de proyectos (6 imágenes con modal)
   - Opiniones de clientes (con valoración y enlace a Google Reviews)
   - FAQs (5 preguntas frecuentes)
   - Garantías y confianza (6 puntos de valor)

5. **Páginas de servicio individuales**
   - Cada servicio tiene su página dedicada con detalles específicos
   - Mismo diseño y navegación consistente
   - CTAs integrados en cada página

### SEO y Metadatos
- **Open Graph** y **Twitter Cards** para compartir en redes sociales
- **Schema.org** - Datos estructurados (Organization, AggregateRating)
- **Sitemap.xml** y **robots.txt** configurados
- **Meta descripciones** optimizadas
- **Imágenes con lazy loading**
- **URLs canónicas** y estructura semántica HTML5

### Elementos de Conversión
- **Múltiples CTAs** - Botones estratégicamente ubicados en hero, secciones y formularios
- **WhatsApp flotante** - Botón siempre visible para contacto rápido
- **Formulario optimizado** - Con campos específicos para captar información relevante
- **Enlaces compartibles** - Permite compartir presupuestos con enlaces personalizados

## 🚀 Configuración

### Base de Datos (Opcional)

La web soporta dos modos de almacenamiento:

#### Modo Local (por defecto)
- Los datos se guardan en `localStorage` del navegador
- No requiere configuración
- **Limitación:** Solo accesible desde el mismo navegador

#### Modo Firestore (recomendado para producción)

Para habilitar Firestore y almacenar datos en la nube:

1. **Crea un proyecto en Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Configura la app web:**
   - Ve a **Project Settings** → **General** → **Your apps**
   - Haz clic en el icono `</>` para añadir una app web
   - Copia la configuración que aparece

3. **Edita `db-config.js`:**
   ```javascript
   window.DB_PROVIDER = 'firestore';
   window.FIREBASE_CONFIG = {
     apiKey: "AIzaSyC...",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123",
     measurementId: "G-XXXXXXXXXX" // Opcional
   };
   ```

4. **Configura reglas de seguridad en Firestore:**
   - Ve a **Firestore Database** → **Rules**
   - Usa estas reglas básicas (ajusta según necesidades):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /quotes/{document=**} {
         allow read, write: if true; // En producción, añade autenticación
       }
     }
   }
   ```

**Nota:** Si no configuras Firestore o hay un error, automáticamente se usará localStorage como fallback.

### Números de Contacto

Actualiza los números de teléfono y WhatsApp en:
- `index.html` (enlaces `tel:` y `wa.me`)
- Todas las páginas de servicios
- Footer

### URLs de Redes Sociales

Edita los enlaces en:
- `index.html` (footer, schema.org)
- Reemplaza `#` por URLs reales de Facebook e Instagram

## 📱 Responsive

- **Mobile First** - Diseño optimizado para móviles
- **Menú hamburguesa** - Navegación móvil colapsable
- **Barra de contacto fija** - En móvil, acceso rápido a contacto (Presupuesto, Llamar, WhatsApp)
- **Navegación fija** - Header siempre visible al hacer scroll

## 🎯 Objetivos de Negocio

- **Conversión** - Formularios y CTAs estratégicamente ubicados
- **Confianza** - Testimonios, garantías, casos de estudio
- **Transparencia** - Presupuestos a medida, sin tarifas fijas
- **Accesibilidad** - Múltiples formas de contacto (formulario, WhatsApp, teléfono)

## 👨‍💻 Desarrollo

**Desarrollado por:** KryDev

## 📄 Licencia

Propiedad de Grupo Geez Europa. Todos los derechos reservados.

---

*Para más información sobre la empresa, visita la web o contacta a través de los medios disponibles.*

