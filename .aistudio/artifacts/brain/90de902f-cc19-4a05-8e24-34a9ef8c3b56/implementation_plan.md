# Homogeneización Visual y Funcional de los Primeros 3 Pasos del Flujo de Reserva

Unificación del flujo de agendamiento en sus primeros tres pasos (*Tu look*, *Lo que traes puesto*, y *Diseño & Nail Art*), aplicando una estética uniforme libre de ruido visual, con cuadrículas 2x2 balanceadas, metadatos tipográficos unboxed, sin preselecciones iniciales y con un resumen minimalista continuo.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas por el usuario durante la fase de clarificación:

- **Estructura del Paso 3 (Diseño & Decoración)**: Cuadrícula 2x2 simétrica para los niveles de Nail Art y acabados, eliminando contenedores redundantes y badges tipo píldora.
- **Preselección en el Paso 3**: Sin selección previa al abrir; la clienta toma una decisión consciente (o explícitamente elige *Liso / Sin Decoración*) antes de habilitar la continuación.
- **Encabezado y Avance Transversal**: Resumen minimalista sin cajas que exhibe la duración acumulada y el precio estimado con tipografía sutil y números tabulares (`tabular-nums`).

---

## 1. Overview & Core Concept

- **Propósito**: Garantizar que la clienta experimente una transición fluida y visualmente armónica a través de los tres pasos iniciales de personalización de su cita:
  1. **Paso 1 - ¿Qué te gustaría hacerte hoy?**: Selección de look base (cuidado, color, extensiones, o mantenimiento en 2 columnas paralelas).
  2. **Paso 2 - Lo que traes puesto**: Diagnóstico de retiro de producto anterior en cuadrícula 2x2 unboxed.
  3. **Paso 3 - Diseño & Nail Art**: Elección de nivel de decoración y acabado final en cuadrícula 2x2 simétrica, con metadatos tipográficos limpios.
- **Audiencia**: Clientas del salón que buscan una experiencia de reserva digital rápida, intuitiva, transparente y de estética premium.
- **Valor Clave**: Cero fatiga cognitiva y consistencia visual total: las mismas dimensiones de tarjeta, los mismos radios de borde, la misma jerarquía de texto y el mismo comportamiento de validación paso a paso.

---

## 2. User Experience & Visual Design

### Flujo de Usuario Paso a Paso

1. **Apertura del Flujo**:
   - Todo comienza en estado neutro (`null`), sin tarjetas preseleccionadas ni sub-opciones desplegadas anticipadamente.
   - El botón inferior indica claramente la acción requerida (*"Elige tu look para continuar"*).
2. **Navegación al Paso 2**:
   - Al seleccionar el look base, se desbloquea el avance al Paso 2.
   - En el Paso 2, las 4 opciones de retiro de producto anterior (*Natural*, *Semipermanente*, *Rubber*, *Extensiones*) se presentan en cuadrícula 2x2 limpia.
   - El botón de continuar se activa en cuanto se define la opción.
3. **Navegación al Paso 3 (Homogeneizado)**:
   - Se presenta el catálogo de decoración (A0 Liso, A1 Sutil, A2 Intermedio, A3 Diseños Complejos) en cuadrícula 2x2 idéntica en padding, bordes y tipografía a la del Paso 2.
   - Sub-selector de efectos y acabados (Brillante, Glazed, Mate, Ojo de Gato) en cuadrícula uniforme.
   - La información de precio y tiempo adicional aparece como texto sutil (`· +15 min · +$80 MXN`) en lugar de etiquetas de colores o chips pesados.
4. **Resumen Superior Minimalista**:
   - En la parte superior del asistente, una línea editorial sobria muestra el progreso del paso (`Paso X de 4`) junto a los acumulados en tiempo y costo en cifras tabulares (`~75 min · $460 MXN`), sin barras de estado intrusivas ni cajas compuestas.

### Estética & Sistema Visual

- **Paleta Neutra & Acentos**:
  - 60% lienzo claro/oscuro equilibrado (`bg-background`).
  - 30% superficies estructurales (`bg-card`, bordes sutiles `border-border/60`).
  - 10% acento primario suave al seleccionar tarjeta activa (anillo de foco sutil, fondo tintado y check discreto).
- **Cero Píldoras (Zero-Pill Discipline)**:
  - Ninguna tarjeta mostrará cápsulas redondeadas con fondos de colores fuertes para precios o minutos.
  - Toda la metadata se renderiza en texto plano con separadores elegantes (`·`).
- **Ritmo Espacial**:
  - Cuadrículas `grid-cols-2` en móviles y pantallas medianas con espacios uniformes (`gap-2.5` a `gap-3`).
  - Paddings simétricos en tarjetas (`p-3.5` a `p-4`), esquinas redondeadas coherentes (`rounded-2xl`).

---

## 3. Key Product Decisions & Trade-Offs

- **Cuadrícula 2x2 para Niveles de Nail Art en Paso 3**:
  - *Decisión*: Reemplazar las tarjetas apiladas o desproporcionadas por una cuadrícula 2x2 simétrica para los 4 tiers de decoración (A0, A1, A2, A3).
  - *Motivo*: Replica exactamente la armonía espacial lograda en el Paso 2 y en la sección de mantenimiento del Paso 1, permitiendo a la clienta comparar las opciones de un solo vistazo sin desplazamientos excesivos.
- **Apertura Neutra en Paso 3**:
  - *Decisión*: Inicializar `selectedArtTier` como `null` hasta que la clienta seleccione su nivel preferido (incluso si desea *Liso / Sin Decoración*).
  - *Motivo*: Evita asumir preferencias por adelantado y garantiza que el botón de avanzar valide que la clienta vio y aprobó el nivel de diseño deseado.
- **Componente Unificado o Refactor Modular para Paso 3**:
  - *Decisión*: Extraer o refactorizar el paso 3 dentro de un componente modular limpio (`NailArtStep.tsx` o similar a `CurrentWearStep.tsx` y `LookSelectionStep.tsx`).
  - *Motivo*: `DirectBookingFlow.tsx` supera las 1,700 líneas; modularizar el Paso 3 reduce la complejidad, previene errores colaterales y asegura que los tres pasos compartan la misma arquitectura de componentes.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Flujo y Componentes

```
┌───────────────────────────────────────────────────────────────┐
│                    DirectBookingFlow (Shell)                  │
│   • Estado Global: selectedLook, currentWear, selectedArtTier  │
│   • Cálculos Reactivos: lookPriceCalc, lookDurationCalc       │
│   • Encabezado Minimalista: Paso X de 4 · Duración · Precio   │
└───────────────────────────────┬───────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ LookSelectionStep│    │ CurrentWearStep  │    │   NailArtStep    │
│     (Paso 1)     │    │     (Paso 2)     │    │     (Paso 3)     │
├──────────────────┤    ├──────────────────┤    ├──────────────────┤
│ • 5 Looks Base   │    │ • Cuadrícula 2x2 │    │ • Cuadrícula 2x2 │
│ • Mantenimiento  │    │ • 4 Opciones de  │    │   Nail Art (4)   │
│   2 Columnas     │    │   Retiro previo  │    │ • Acabados 2x2   │
│ • No preselect   │    │ • No preselect   │    │ • No preselect   │
│ • Texto sin pills│    │ • Texto sin pills│    │ • Texto sin pills│
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### Plan de Cambios Específicos

1. **Creación del componente modular `NailArtStep.tsx`**:
   - Props limpias: `selectedArtTier`, `onSelectArtTier`, `selectedFinish`, `onSelectFinish`, `selectedLook`, `onContinue`.
   - Cuadrícula 2x2 para tiers (`grid-cols-2 gap-2.5 sm:gap-3`).
   - Cuadrícula 2x2 para acabados.
   - Metadatos unboxed (precio y duración sutiles con `tabular-nums`).
   - Botón inferior deshabilitado hasta contar con selección válida.
2. **Actualización de Estado en `DirectBookingFlow.tsx`**:
   - Ajustar el estado inicial de `selectedArtTier` a `null` (o permitir avanzar una vez confirmado).
   - Validar `canNext` en paso 3: `Boolean(selectedArtTier)`.
   - Ajustar el encabezado de pasos para mostrar un resumen unboxed sobrio (`Paso X de 4 · ~XX min · $XXX MXN`).
3. **Verificación y Calidad**:
   - Ejecución de `lint_applet` y `compile_applet` para garantizar cero regresiones y compilación limpia.
