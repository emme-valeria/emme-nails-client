ido con desenfoque de fondo de `25px` (efecto esmerilado de panel trasero).
*   `material-regular`: Desenfoque de `30px` y mayor opacidad para paneles flotantes o ventanas emergentes.
*   `premium-card`: Tarjetas con radio de esquina suavizado (`24px`), un microborde gris del 4% de opacidad (`border-black/[0.04]`), y una sombra extendida difusa que levanta la tarjeta sutilmente al pasar el cursor.

### C. Tipografía Elegante
Utiliza importaciones dinámicas desde Google Fonts y fuentes del sistema optimizadas:
*   **Display / Cabeceras**: `Inter Tight` o `SF Pro Display`, configurada con tracking ajustado (`tracking-tight`) para dar un aspecto compacto y moderno de revista editorial.
*   **Texto Libre**: `Inter` o `SF Pro Text`, con balance óptimo de espacios y peso de fuente mediano para interfaces densas de datos.
*   **Datos / Indicadores**: `SF Mono` o `JetBrains Mono` para marcas de tiempo, totales financieros y estados del sistema.

---

## 3. Arquitectura del Flujo de Datos (Estado Global)

La aplicación utiliza un patrón de arquitectura SPA (Single Page Application) reactivo donde **`AppContext.tsx`** actúa como el núcleo de estado y el orquestador principal del sistema.

```
       ┌───────────────────────────────────────────────────┐
       │                 AppContext.tsx                    │
       │  (State: services, clients, appointments, profile)│
       └─────────────────────────┬─────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  cacheService    │    │   Google Auth    │    │ Google Workspace│
│  (LocalStorage)  │    │  (Firebase Auth) │    │ (Calendar/Sheets│
│  Persistencia    │    │  OAuth Token     │    │ API REST Client)│
└──────────────────┘    └──────────────────┘    └─────────────────┘
```

### El Modelo de Datos Unificado
El contexto global maneja cuatro entidades altamente tipadas en TypeScript:

1.  **Servicios (`Service`)**:
    *   `id` (UUID), `name`, `description`, `price`, `duration` (en minutos), `category` (Manicura Natural, Extensiones, Pedicura, Nail Art, etc.), e `isActive` (booleano para visibilidad comercial).
2.  **Clientes (`Client`)**:
    *   `id` (UUID), `name`, `phone` (formato telefónico internacional), `email`, `notes` de cuidado, `allergies` (crítico para productos como metacrilatos y látex), `preferences` (música, bebidas) e `isVip`.
3.  **Citas (`Appointment`)**:
    *   `id` (UUID), `clientId`, `serviceId`, `date` (ISO `YYYY-MM-DD`), `startTime`/`endTime` (`HH:mm`), `notes` específicas del diseño de uñas, y `googleEventId` (para trackeo con Google Calendar).
4.  **Perfil del Negocio (`BusinessProfile`)**:
    *   Especifica la meta financiera mensual (`monthlyGoal`), horarios semanales laborales activos, un sistema automático simulado para recordatorios de WhatsApp, promociones activas e históricas, y fechas festivas o vacaciones configurables.

---

## 4. Estructura de Módulos de la Aplicación

La navegación lateral (`Sidebar` en escritorio, `MobileNav` en formato móvil) enruta de forma elegante a las siguientes vistas:

### I. Dashboard de Control Comercial (`/dashboard`)
*   Muestra 4 tarjetas de KPIs instantáneos: Facturación del Mes, Meta Mensual (con barra de progreso visual circular o lineal), Citas de Hoy y Nuevas Clientas.
*   **Visualizaciones de Datos**: Incorpora un panel analítico interactivo con gráficos de líneas y barras con transiciones suaves suministradas por `recharts` que muestran la facturación real con respecto a las metas.
*   Visualización de "Próximas Citas" interactivas con cambio de estado rápido.

### II. Agenda Calendario (`/agenda`)
*   Soporta filtrado temporal diario mediante el componente estético `react-day-picker` integrado en un popover estilo Apple.
*   Muestra el día de forma cronológica en bloques de tiempo verticales u horizontales.
*   Permite añadir citas de forma intuitiva arrastrando datos o seleccionando un formulario flotante con autocompletado inteligente de clientes y servicios previamente creados.

### III. Directorio de Clientas (`/clients`)
*   Presenta un buscador de alta velocidad que filtra registros por nombre o número telefónico.
*   Muestra información sensible de forma directa: Tarjetas táctiles individuales donde se destacan alertas en rojo si el cliente presenta **alergias**, notas de preferencias personales (p. ej., *"toma café descafeinado"*), y un botón de acceso directo para enviar recordatorios rápidos.

### IV. Catálogo de Servicios (`/services`)
*   Organizado de forma visual mediante pestañas categorizadas por tipo de tratamiento.
*   Permite añadir nuevos servicios ingresando nombre, duración estimada en minutos y precio del servicio.
*   Facilita la desactivación temporal de cualquier servicio mediante interruptores táctiles (`Switch`), lo cual oculta instantáneamente el servicio de los selectores de agendas sin necesidad de borrar los reportes históricos.

### V. Finanzas y Desempeño (`/finances`)
*   Sección enfocada puramente en números del negocio.
*   Mapea ingresos brutos acumulados frente a gastos de stock e insumos.
*   Desglosa los servicios más demandados por porcentaje y volumen, permitiendo planificar campañas de márketing.

### VI. Panel de Configuración e Integraciones (`/settings`)
*   **Configuración del Salón**: Horarios detallados de apertura, cierre y tiempos de almuerzo.
*   **Fechas Especiales**: Gestión de vacaciones, feriados nacionales y días de horario reducido.
*   **Automatización de Notificaciones**: Editor interactivo de platillas de WhatsApp usando comodines dinámicos como `{cliente}`, `{servicio}`, `{fecha}` y `{hora}`.
*   **Control de Integración con Google**: Interfaz interactivo para enlazar la cuenta de Google, activar o desactivar la sincronización en segundo plano de Google Calendar, y configurar la exportación inteligente de reportes comerciales a Google Sheets.

---

## 5. Integración Tecnológica con Google Workspace

La característica más potente de EmmeNails es su comunicación nativa con APIs de Google sin requerir servidores intermediarios que vulneren la privacidad del usuario, realizando llamadas seguras utilizando tecnologías del navegador.

```
                  ┌─────────────────────────────────┐
                  │       Flow de Google Sync       │
                  └────────────────┬────────────────┘
                                   │
                [Cita Creada, Modificada o Cancelada]
                                   │
                                   ▼
                   ¿Tiene Cuenta Google Conectada?
                     /                         \
                   SÍ                           NO
                   /                             \
     ┌────────────┴─────────────┐           [Fin de Flujo:
     │   Calendar Sync          │         Persiste solo local]
     │   - PUT/POST a events    │
     │   - DELETE si cancelada  │
     └────────────┬─────────────┘
                  │
                  ▼
     ┌──────────────────────────┐
     │   Sheets Auto Export     │
     │   - BatchUpdate pestañas │
     │   - Sync Clients & Citas │
     │   - Recalcula KPI Finanzas│
     └──────────────────────────┘
```

### A. Capa de Autenticación (`googleAuth.ts`)
*   Utiliza la biblioteca oficial de **Firebase Authentication** bajo el proveedor `GoogleAuthProvider`.
*   Solicita dos ámbitos de permisos (Scopes) con consentimiento explícito de la usuaria:
    1.  `https://www.googleapis.com/auth/calendar.events` (Lectura y edición de eventos de calendario).
    2.  `https://www.googleapis.com/auth/spreadsheets` (Acceso completo para crear y editar hojas de cálculo).
*   Guarda una referencia del token temporal en `sessionStorage` para restaurar silenciosamente la sesión ante reinicios del ambiente y refrescar estados visuales.

### B. Módulo de Calendario (`googleWorkspace.ts`)
*   **Mapeo de Husos Horarios**: Determina el huso horario local de la manicurista (ej. `Europe/Madrid`) para formatear las horas de inicio de forma precisa bajo la especificación ISO 8601.
*   **Creación y Actualización (`syncAppointmentToCalendar`)**:
    *   Envía peticiones `POST` al endpoint primario de Calendar para nuevas citas.
    *   Envía peticiones `PUT` indicando el `googleEventId` previo si la cita sufre cambios de horario o día.
*   **Sincronización del Estado**: Si la cita se marca con estado `'cancelled'`, el sistema hace una llamada `DELETE` directa para remover la cita de Google Calendar automáticamente.
*   **Colores de Evento**: Asigna identificadores de color específicos en Calendar según el estado de la cita (`colorId: 10` verde si está finalizada, azul/amarillo si está pendiente o confirmada).

### C. Módulo de Hojas de Cálculo (Generador de Reportes de Google Sheets)
Cuando la sincronización a Sheets está activa y el usuario modifica registros, la aplicación ejecuta secuencialmente:
1.  **Creación**: Si no existe una hoja de cálculo asociada, la aplicación invoca un `POST` a `/v4/spreadsheets` creando un archivo titulado `"EmmeNails - Sincronización de Negocio"`.
2.  **Configuración de Pestañas (`setupSpreadsheetTabs`)**:
    Realiza un `batchUpdate` a la API de Sheets para cerciorarse de que existan tres pestañas diferenciadas, aplicando el congelado de fila superior (`frozenRowCount: 1`) para facilitar la navegación:
    *   `"Listado de Clientas"`: Exporta ID abreviado, Nombre, Teléfono, Correo, Alergias, Cumpleaños y Estado VIP.
    *   `"Citas y Agenda"`: Sincroniza todas las citas con detalle de Clienta, Servicio contratado, fecha, horas y ganancia bruta de esa cita.
    *   `"Resumen Financiero"`: Genera una vista ejecutiva dinámica de métricas clave calculando totales en tiempo real (Facturación completada, ticket promedio, cantidad de citas por estado, etc.) junto con la marca de tiempo exacta del proceso.

---

## 6. Estructura de Archivos del Proyecto

La organización del código es modular para asegurar la escalabilidad del sistema:

*   `/src/main.tsx`: Punto de entrada que inicializa React en modo estricto, encapsulado dentro de `AppProvider`.
*   `/src/App.tsx`: Enrutador central con transiciones elegantes proporcionadas por `motion` (fades y deslizamiento vertical amortiguado) que alternan entre rutas analíticas (`/dashboard`, `/agenda`, `/clients`, `/services`, `/finances`, `/settings`).
*   `/src/context/`:
    *   `AppContext.tsx`: Gestor central del estado reactivo global del negocio y pasarela de sincronización con Google.
*   `/src/services/`:
    *   `cacheService.ts`: Almacenamiento local encapsulado de datos persistentes.
    *   `googleAuth.ts`: Autenticación segura y persistencia de sesión a través de Firebase.
    *   `googleWorkspace.ts`: Consumidor REST directo de las APIs de Sheets y Calendar v3/v4 de Google.
*   `/src/components/`:
    *   `/layout/`: Barra de navegación responsive (`Navigation.tsx`).
    *   `/dashboard/`: Gráficos de tendencias, tarjetas sutiles y widgets ágiles.
    *   `/appointments/`: Vistas de calendario, controles de estados de cita y formularios de reserva rápida.
    *   `/clients/`: Buscadores de clientes, paneles de datos clínicos y contacto directo.
    *   `/services/`: Clasificación de tratamientos por pestañas táctiles e interruptores lógicos.
    *   `/finances/`: Métricas de costos, metas y rentabilidad por servicio.
    *   `/settings/`: Configuración del bot, horarios con descanso, días feriados y conexión de Google.
    *   `/onboarding/`: Interfaz interactiva de bienvenida y configuración rápida inicial del salón.
    *   `/ui/`: Componentes atómicos pulidos y accesibles (botones con feedback elástico `active:scale-[0.95]`, inputs premium, selects, dropdowns, etc.).

---
# EmmeNails - Studio Manager
## Documento de Diseño de la Aplicación

Este documento detalla la arquitectura, el diseño de la interfaz de usuario (UI), el modelo de datos y las integraciones del sistema **EmmeNails - Studio Manager**, una plataforma de software premium diseñada para manicuristas independientes y salones de belleza con el fin de optimizar sus operaciones, finanzas de negocio y la retención de clientes.

---

## 1. Misión y Filosofía del Producto

El software se ha concebido desde cero para ofrecer una alternativa sofisticada frente a las interfaces de administración tradicionales que suelen resultar confusas o sobrecargadas. Su misión es dotar a las profesionales de la manicura de una herramienta estética que inspire tanto profesionalismo como orden visual.

### Pilares Clave del Producto
*   **Aesthetic First**: Un diseño limpio, orgánico y con espaciados generosos influenciado directamente por los lenguajes de diseño de Apple Inc. (Clean Tech).
*   **Integración Transparente**: Sincronización directa en tiempo real con las cuentas de Google de las usuarias (Google Calendar para la agenda personal y Google Sheets para hojas de cálculo de auditoría).
*   **Cero Latencia**: Persistencia reactiva local apoyada por un caché robusto para que el flujo de uso sea instantáneo, incluso tras reinicios o refrescos.

---

## 2. Filosofía de Diseño Visual y UX (Estilo "Apple Premium")

La identidad de diseño del "Studio Manager" está anclada en la sutileza, los contrastes nítidos y las texturas suaves. Evita el "ruido visual" y los gradientes sobresaturados comunes, optando en su lugar por:

### A. Paleta de Colores (Alta Legibilidad y Contraste)
*   **Fondo Principal (`--background`)**: `#FBFBFD` — El blanco roto de Apple que reduce la fatiga visual.
*   **Color de Texto (`--foreground`)**: `#1D1D1F` — Un carbón casi negro que evita contrastes estridentes y mantiene el rigor editorial.
*   **Color Primario (`--primary`)**: `#0071E3` — El icónico azul de interacción de Apple para botones primarios y acentos seleccionados.
*   **Soportes Neutros (`--muted-foreground`)**: `#86868B` — Gris suave para etiquetas secundarias e información de soporte.

### B. Efectos de Materiales (Glassmorphism)
La aplicación emplea clases especiales que imitan refracción de luz física mediante bordes sutiles y desenfoques intensivos utilizando el motor de renderizado CSS:
*   `material-thin`: Fondo translúc
Este ecosistema ha sido diseñado y codificado con altos estándares de calidad, asegurando un rendimiento fluido, seguridad en el manejo de tokens API y una experiencia estética premium para la administración del estudio.
