# Emme Studio — Design System & Architecture

**Versión:** 2.5.0
**Estado:** Documento vivo
**Ámbito:** Aplicación cliente Expo para iOS, Android y web; módulos Vite heredados del Studio Manager
**Identidad:** Belleza boutique, minimalismo editorial y rosa Emme

> Este documento separa el comportamiento implementado del roadmap. No considerar una integración como activa si aparece únicamente en la visión futura.

---

## 1. Producto y alcance

Emme Studio conecta a las clientas con los servicios del estudio: descubrir tratamientos, cotizar diseños de uñas, conversar con Emme AI y reservar citas. La experiencia principal se está migrando a Expo Router para compartir interfaz y navegación entre iOS, Android y web.

El repositorio también conserva el código anterior de **EmmeNails Studio Manager**, una SPA Vite con lógica administrativa. Esta base heredada no equivale a que todas sus vistas o integraciones estén conectadas a la app Expo.

### Principios de experiencia

- **Belleza silenciosa:** superficies claras, jerarquía tipográfica y espacio negativo; el rosa destaca acciones, no compite con el contenido.
- **Una acción principal por momento:** reservar, cargar una referencia o continuar una conversación debe ser fácil de descubrir y tocar.
- **Contexto sobre decoración:** mostrar detalles reales de la cita cuando existan y un estado vacío útil cuando no existan.
- **IA con expectativas honestas:** indicar cuándo una estimación es orientativa o cuando el backend inteligente no está disponible.
- **Progresión clara:** dividir cotización en referencia, análisis y resultado; evitar formularios que se alarguen innecesariamente.
- **Accesibilidad táctil:** controles de tamaño suficiente, estados seleccionados identificables y contraste legible.

---

## 2. Identidad visual y tokens

Base Apple Light, con el azul de acción sustituido por el rosa de marca Emme (`#E05286`). Mantener los neutros y colores semánticos sin teñirlos de rosa.

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#FBFBFD` | Fondo general |
| `--foreground` | `#1D1D1F` | Texto principal |
| `--primary` | `#E05286` | Acciones y acentos Emme (sustituye el azul Apple) |
| `--primary-fg` | `#FFFFFF` | Texto sobre acción primaria |
| `--secondary` | `#F5F5F7` | Tarjetas y contenedores secundarios |
| `--secondary-fg` | `#1D1D1F` | Texto sobre superficies secundarias |
| `--muted` | `rgba(0,0,0,0.05)` | Superficies suaves y divisores |
| `--muted-foreground` | `#86868B` | Metadatos y subtítulos |
| `--accent` | `rgba(224,82,134,0.10)` | Realces y estados activos rosas |
| `--destructive` | `#FF3B30` | Alertas críticas/cancelaciones |
| `--border` | `rgba(0,0,0,0.08)` | Delimitadores finos |
| `--input` | `rgba(0,0,0,0.03)` | Fondo de campos |

Colores semánticos: éxito/confirmado Emerald `#10B981`; pendiente/precaución Amber `#F59E0B`; cancelación/alerta Red `#EF4444`; VIP Purple/Indigo `#6366F1`. Conservar sus significados y comprobar contraste en cada combinación; para texto normal, objetivo WCAG AA de 4.5:1.

### Materiales y elevación

- Tarjetas principales: fondo blanco, radio de 20–28 px, borde neutro de baja opacidad y sombra difusa suave.
- Panel inferior/tab bar: superficie opaca o translúcida discreta, separación clara del contenido y respeto de safe areas.
- Evitar bordes oscuros, sombras duras y halos decorativos que resten legibilidad.
- En React Native usar `StyleSheet`, `expo-linear-gradient` y elevación/sombra nativa; CSS de `globals.css` solo aplica a la SPA Vite.

### Tipografía

- **Inter:** interfaz, controles, datos y texto general.
- **Cormorant Garamond / serif editorial:** titulares puntuales de marca, cuando esté disponible en la plataforma.
- Títulos con peso claro y tracking compacto; textos secundarios con interlineado suficiente.
- No depender de fuentes remotas para mostrar contenido crítico: precargar o usar fallback del sistema.

### Geometría e interacción

- Formularios e inputs: radio de 16 px (`rounded-2xl`).
- Botones estándar: radios de 12–16 px (`rounded-xl`–`rounded-2xl`); controles icon-only pueden ser circulares.
- Tarjetas: radio de 24 px. Modales y paneles grandes: radio de 32 px. Badges y pills: radio completo.
- Feedback táctil breve: `active:scale-[0.98]` o `active:scale-[0.95]`; reservar el efecto para elementos interactivos.
- Curva común: `cubic-bezier(0.23,1,0.32,1)`, 300–500 ms. En Expo Reanimated, animar preferentemente `transform` y `opacity` y respetar movimiento reducido.

---

## 3. Arquitectura actual

### Expo cliente (entrada principal)

- Expo SDK 57, React Native y Expo Router; rutas en `app/`.
- `app/_layout.tsx`: providers, protección de rutas y splash animada.
- `src/expo/AuthContext.tsx`: sesión local de desarrollo, persistida en AsyncStorage.
- `src/expo/BookingContext.tsx`: citas locales por perfil/dispositivo, persistidas en AsyncStorage.
- `src/expo/api.ts`: cliente HTTP Expo multiplataforma para endpoints del servidor.
- `src/expo/AnimatedSplash.tsx`: splash de marca, carga de Inter, modo oscuro y movimiento reducido.

### Rutas Expo

| Ruta | Función actual |
|---|---|
| `/(tabs)` | Inicio, saludo, accesos a cotización/reserva y próxima cita |
| `/(tabs)/agenda` | Lista de citas guardadas localmente |
| `/(tabs)/chat` | Conversación con Emme AI |
| `/(tabs)/profile` | Perfil local y cierre de sesión |
| `/services` | Catálogo de servicios |
| `/booking` | Selección de servicio, día y hora; guarda en el dispositivo |
| `/quotes` | Referencia fotográfica, análisis animado y resultado editable |
| `/login` | Flujo de desarrollo local, no verifica SMS real |

El tab bar Expo tiene cuatro destinos: Inicio, Chat, Mis Citas y Perfil. En Inicio, los accesos rápidos abren Cotizar con IA y Agendar cita.

### API y Vite heredado

- `server.ts` ejecuta Express en el puerto `3000`, sirve `/api/health`, `/api/gemini/chat` y `/api/gemini/analyze-nail-image`.
- Expo Web se sirve por Metro, normalmente en el puerto `8081` (o el puerto que imprima Expo). Para desarrollo, `npm run web` inicia API y Expo juntos.
- Un teléfono físico no puede usar `localhost` para llegar al ordenador: configurar `EXPO_PUBLIC_API_URL` con la IP LAN del ordenador y compartir la misma Wi‑Fi.
- Vite se conserva mediante `legacy:dev`, `legacy:build` y `legacy:start`. La carpeta `src/` contiene la SPA y los módulos heredados. El `index.html` raíz es actualmente una splash HTML independiente y no monta el cliente Vite.

---

## 4. Flujos de clienta

### Inicio

- Cabecera de marca con mascota y saludo adaptable al estado de cita.
- Acciones rápidas: Cotizar con IA y Agendar cita.
- Tarjeta principal de cita: servicio, día, hora y acceso a gestión; si no hay cita, presentar un estado vacío claro con acceso a reserva.
- Mantener el contenido dentro de un `ScrollView`, dejando margen inferior para el dock flotante y safe area.

### Cotización con IA

1. Elegir foto de galería; comprimir con `expo-image-manipulator`.
2. Añadir notas y preferencias rápidas opcionales.
3. Mostrar una vista de análisis con barrido animado y mensajes por etapa.
4. Presentar el resultado en una pantalla separada: foto, servicio sugerido, descripción, forma, largo, complejidad, técnica, colores, tiempo y estimado.
5. Permitir editar forma y largo antes de pasar a reserva.

El backend valida si hay uñas y puede producir un fallback local. Sin `GEMINI_API_KEY`, el resultado es orientativo y no debe presentarse como análisis real de Gemini.

### Reserva

- Selección de servicio, día y hora.
- Confirmación visible antes de guardar.
- Actualmente la cita queda guardada en AsyncStorage; no se sincroniza con calendario ni con el estado del Studio Manager.

### Chat

- Historial y entrada táctil con sugerencias.
- El cliente llama al endpoint server-side de Gemini. Acciones sugeridas pueden enlazar catálogo, cotización y reserva.
- No exponer claves de IA en variables `EXPO_PUBLIC_*`.

---

## 5. Contratos de datos Expo actuales

### Perfil local (`ExpoClient`)

```ts
export type ExpoClient = {
  name: string;
  phone: string;
  signedInAt: number;
};
```

La autenticación es una simulación local de desarrollo; el código de seis dígitos no se verifica con SMS ni Firebase.

### Cita local (`NativeAppointment`)

```ts
export type NativeAppointment = {
  id: string;
  service: string;
  day: string;
  time: string;
  createdAt: number;
};
```

### Análisis de uñas (`GeminiNailImageAnalysis`)

Incluye detección de uñas, motivo de rechazo, servicio recomendado, técnica, forma, largo, complejidad, colores, extras, duración, precios, descripción, consejo profesional y marca de fallback.

Los contratos administrativos más ricos de `src/domain` y `src/app/AppContext.tsx` pertenecen a la aplicación heredada y aún no están unificados con los contratos Expo.

---

## 6. Sistema de componentes y accesibilidad

- Componentes compartidos y reglas visuales deben vivir fuera de `app/`, dejando allí solo rutas/layouts.
- Botones con `accessibilityRole`, `accessibilityLabel` cuando el icono no sea autoexplicativo, y `accessibilityState` para disabled/selected/busy.
- Estados deshabilitados deben conservar texto legible y explicar cómo continuar.
- Inputs con placeholder breve, borde visible, estado de foco y teclado adecuado al dato.
- Imágenes con `accessibilityLabel` cuando aportan información; las decorativas deben ignorarse por lectores de pantalla.
- Back, cerrar y acciones principales con áreas táctiles de al menos 44 × 44 pt.
- No usar únicamente color para indicar selección o error.
- Usar `KeyboardAvoidingView` en formularios y `keyboardShouldPersistTaps="handled"` en scrolls con controles.

---

## 7. Seguridad, persistencia y configuración

- `AsyncStorage` es almacenamiento local de conveniencia, no almacén seguro para credenciales o secretos.
- `GEMINI_API_KEY` permanece en el servidor Express; nunca incluirla en el bundle móvil.
- Las CORS de desarrollo deben limitarse a origen local o a orígenes configurados.
- Configuración del splash nativo en `app.json` debe coincidir con el fondo del splash animado: claro `#FDFDFD`, oscuro `#0E0E10`.
- Revisar permisos de fotos/cámara en iOS/Android y explicar el motivo antes de solicitarlos.

---

## 8. Scripts útiles

```sh
npm run web          # API + Expo Web
npm run ios          # API + Expo en simulador iOS
npm run android      # API + Expo en emulador Android
npm run build        # Exportación web Expo
npm run lint         # TypeScript del proyecto
npm run legacy:dev   # Servidor/API y cliente Vite heredado
npm run legacy:build # Build Vite heredado
```

---

## 9. Roadmap, no implementado aún

- Autenticación real con Firebase/OTP y gestión segura de sesión.
- Sincronización backend de perfiles, citas y catálogo entre dispositivos.
- Disponibilidad real de agenda, cancelaciones, reprogramación y reglas de negocio centralizadas.
- Integración de pagos/señas y confirmaciones.
- Sincronización con Google Calendar y Sheets desde un backend con autorización explícita.
- Módulos administrativos completos de clientas, finanzas, horarios, promociones, inventario y panel de negocio.
- Onboarding y preferencias de notificaciones multiplataforma.
- Configurar `GEMINI_API_KEY` y validar cotizaciones reales en iOS, Android y web.

---

**Regla de mantenimiento:** al cambiar una ruta, contrato o integración, actualizar este documento y marcar explícitamente si la capacidad está implementada, en desarrollo o en roadmap.
