import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
process.env.DISABLE_HMR = "true";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy/safe Gemini AI client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "undefined" || apiKey === "null") {
    console.warn("GEMINI_API_KEY is not configured or empty.");
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5),
    timestamp: new Date().toISOString(),
  });
});

// Fallback chat generator when Gemini API is unavailable or returns 401
function getLocalChatFallback(message: string, context?: any) {
  const lower = message.toLowerCase();
  
  if (lower.includes("catálogo") || lower.includes("precio") || lower.includes("servicios") || lower.includes("cuánto cuesta")) {
    return {
      text: "✨ **Catálogo de Servicios Populares:**\n- **Manicura Rusa Express**: $420 MXN (45 min)\n- **Manicura Rusa + Semi**: $550 MXN (60 min)\n- **Soft Gel / Gel-X Completo**: $750 MXN (75 min)\n- **Uñas Esculturales Acrílico**: $890 MXN (90 min)\n- **Pedicura Spa Deluxe**: $620 MXN (60 min)\n- **Lash Lifting + Keratina**: $600 MXN (50 min)\n\n¿Deseas agendar o cotizar un diseño personalizado?",
      suggestedReplies: ["Agendar cita directa", "Cotizar foto de uñas", "Elegir especialista", "Ver pestañas"],
      widgetType: "catalog",
    };
  }

  if (lower.includes("especialista") || lower.includes("manicurista") || lower.includes("valeria") || lower.includes("staff")) {
    return {
      text: "👩‍🎨 **Nuestras Master Artists en Polanco:**\n- **Valeria R.** (Master Nail Artist - Especialista en Manicura Rusa & Acrílico)\n- **Sofía M.** (Senior Gel-X & Chrome / 3D Art)\n- **Camila K.** (Senior Escultural & Nail Art Avanzado)\n\n¿Con quién te gustaría reservar tu próxima sesión?",
      suggestedReplies: ["Reservar con Valeria R.", "Reservar con Sofía M.", "Ver horarios disponibles", "Cotizar diseño"],
      widgetType: "staff",
    };
  }

  if (lower.includes("foto") || lower.includes("cotizar") || lower.includes("imagen") || lower.includes("diseño")) {
    return {
      text: "📸 ¡Claro que sí! Sube una foto de referencia de tus uñas favoritas y te calcularemos la técnica, tiempo de cabina y precio estimado en tiempo real.",
      suggestedReplies: ["Subir foto para cotizar", "Ver catálogo de servicios", "Agendar cita directa"],
      widgetType: "photo_quote",
    };
  }

  if (lower.includes("pestaña") || lower.includes("lash") || lower.includes("ceja") || lower.includes("lifting")) {
    return {
      text: "👁️ **Especialidades en Pestañas & Cejas:**\n- **Lash Lifting con Keratina & Botox**: $600 MXN\n- **Extensiones Clásicas (1 a 1)**: $800 MXN\n- **Extensiones Híbridas**: $950 MXN\n- **Volumen Ruso**: $1,150 MXN\n- **Laminado de Cejas**: $520 MXN",
      suggestedReplies: ["Agendar Lash Lifting", "Extensiones Clásicas", "Ver catálogo de uñas", "Elegir horario"],
      widgetType: "lash_selector",
    };
  }

  return {
    text: "¡Hola! Soy **EMME AI Spark**, tu asistente de belleza en uñas y pestañas de EmmeNails Polanco. ¿En qué te puedo asesorar hoy?",
    suggestedReplies: [
      "Ver catálogo de servicios",
      "Cotizar foto de uñas",
      "Elegir especialista",
      "Agendar cita directa",
    ],
  };
}

// 1. GEMINI CHAT ENDPOINT
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(getLocalChatFallback(message, context));
    }

    const systemInstruction = `Eres "EMME AI Spark", la asistente virtual experta y amigable de "EmmeNails Studio" (estudio boutique de belleza de uñas y pestañas ubicado en Polanco, CDMX).

PERSONALIDAD Y TONO:
- Eres cálida, profesional, sofisticada, muy atenta y hablas en un español natural de México.
- Eres especialista en manicura rusa (hardware manicure), Soft Gel / Gel-X, Acrílico Escultural, Esmaltado Semipermanente, Polygel, Pedicura Spa y Pestañas / Lashes (Lifting, Clásicas, Híbridas, Volumen Ruso).
- Precios y tiempos referenciales en pesos mexicanos (MXN):
  * Manicura Rusa Express: $420 MXN (45 min)
  * Manicura Rusa + Semi: $550 MXN (60 min)
  * Soft Gel / Gel-X Completo: $750 MXN (75 min)
  * Uñas Esculturales Acrílico: $890 MXN (90 min)
  * Pedicura Spa Deluxe: $620 MXN (60 min)
  * Retoque / Mantenimiento: $480 MXN (50 min)
  * Lash Lifting + Keratina: $600 MXN (50 min)
  * Extensiones Pestañas Clásicas: $800 MXN (75 min)
- Especialistas del Salón:
  * Valeria R. (Master Nail Artist - Especialista en Manicura Rusa y Acrílico)
  * Sofía M. (Senior Gel-X & Chrome / 3D Art)
  * Camila K. (Senior Escultural & Foil Art)

INSTRUCCIONES DE RESPUESTA:
1. Responde de forma clara, concisa y atractiva a las preguntas del usuario.
2. Si el usuario quiere ver opciones, agendar o cotizar, oriéntalo amablemente.
3. Devuelve siempre un JSON con:
   - "text": Tu mensaje en Markdown con formato agradable.
   - "suggestedReplies": Array de 3 a 5 opciones rápidas y pertinentes para el usuario.
   - "widgetType": (opcional) Si la intención coincide con un widget interactivo, incluye uno de estos valores: "catalog", "staff", "photo_quote", "lash_selector", "style_advisor", "aftercare", "proposal_appointment", "booking_flow".
`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.text) {
          contents.push({
            role: item.sender === "user" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: message + (context?.selectedService ? `\n(Contexto actual del usuario: Servicio seleccionado "${context.selectedService}")` : ""),
        },
      ],
    });

    const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: {
                  type: Type.STRING,
                  description: "El mensaje conversacional de respuesta al usuario.",
                },
                suggestedReplies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Lista de 3 a 5 opciones o botones de respuesta sugerida.",
                },
                widgetType: {
                  type: Type.STRING,
                  description: "Tipo de widget a desplegar si aplica.",
                },
              },
              required: ["text", "suggestedReplies"],
            },
          },
        });

        const jsonText = response.text?.trim() || "{}";
        const parsed = JSON.parse(jsonText);
        return res.json(parsed);
      } catch (err: any) {
        lastError = err;
        // Try next candidate model on 503 / high demand / transient error
        continue;
      }
    }

    // Graceful fallback if all models experienced temporary demand spikes
    return res.json(getLocalChatFallback(message, context));
  } catch (error: any) {
    return res.json(getLocalChatFallback(req.body?.message || "", req.body?.context));
  }
});

// Fallback quotation analyzer when Gemini API is unavailable or returns 503/401/429
function getLocalNailAnalysisFallback(userNotes?: string) {
  const notesLower = (userNotes || "").toLowerCase();
  
  let detectedShape: "Almendra" | "Cuadrada" | "Coffin" | "Stiletto" | "Ovalada" | "Natural" = "Almendra";
  if (notesLower.includes("cuadrad")) detectedShape = "Cuadrada";
  else if (notesLower.includes("coffin") || notesLower.includes("bailarina")) detectedShape = "Coffin";
  else if (notesLower.includes("stiletto")) detectedShape = "Stiletto";
  else if (notesLower.includes("oval")) detectedShape = "Ovalada";
  else if (notesLower.includes("natural")) detectedShape = "Natural";

  let detectedLength: "Corto (S)" | "Medio (M)" | "Largo (L)" | "Extra Largo (XL)" = "Medio (M)";
  if (notesLower.includes("corto") || notesLower.includes("pequeñ") || notesLower.includes("s")) detectedLength = "Corto (S)";
  else if (notesLower.includes("extra") || notesLower.includes("xl")) detectedLength = "Extra Largo (XL)";
  else if (notesLower.includes("largo") || notesLower.includes("l")) detectedLength = "Largo (L)";

  let technique = "Soft Gel / Gel-X";
  let recommendedService = "Soft Gel Tips + Nail Art Personalizado";
  let basePrice = 550;
  if (notesLower.includes("acrílic") || notesLower.includes("acrilico") || notesLower.includes("escultural")) {
    technique = "Uñas Esculturales Acrílico";
    recommendedService = "Acrílico Escultural + Nail Art";
    basePrice = 650;
  } else if (notesLower.includes("rusa") || notesLower.includes("semi")) {
    technique = "Manicura Rusa + Semipermanente";
    recommendedService = "Manicura Rusa con Esmaltado Semipermanente";
    basePrice = 450;
  }

  const extras = [
    { name: "Efecto Glazed / Chrome", estimatedCost: 150 },
    { name: "French Tips Mano Alzada", estimatedCost: 100 },
  ];
  if (notesLower.includes("cristal") || notesLower.includes("swarovski")) {
    extras.push({ name: "Cristalería Swarovski / 3D", estimatedCost: 120 });
  }

  const artPrice = extras.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return {
    technique,
    recommendedService,
    nailsDetected: true,
    rejectionReason: "",
    complexity: "Intermedio" as const,
    detectedStyle: "Efecto Glazed Chrome & Acabado Nude Francés",
    detectedColors: ["Nude Rosado", "Blanco Perla", "Chrome Glaze"],
    detectedShape,
    detectedLength,
    detectedExtras: extras,
    estimatedDurationMinutes: 75,
    basePrice,
    artPrice,
    totalEstimatedPrice: basePrice + artPrice,
    description: "Diseño elegante en tonos nude con acabado aperlado glazed chrome y líneas finas.",
    stylistTip: "Recomendamos estructura en Soft Gel para mayor ligereza y durabilidad superior a 3 semanas.",
    fallback: true,
  };
}

// 2. GEMINI MULTIMODAL NAIL IMAGE ANALYSIS & QUOTE CALCULATION ENDPOINT
app.post("/api/gemini/analyze-nail-image", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", userNotes = "" } = req.body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "La imagen en formato base64 es requerida." });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(getLocalNailAnalysisFallback(userNotes));
    }

    const promptText = `Eres una Master Nail Artist y jueza internacional de Nail Art en EmmeNails Studio Polanco.
Analiza minuciosamente esta imagen proporcionada por una clienta para generar una cotización precisa.

PRIMER PASO CRÍTICO - DETECCIÓN DE UÑAS / MANICURA:
Evalúa con alta precisión si la imagen contiene manos humanas, dedos, uñas naturales, uñas esculpidas, pies/pedicura, o un catálogo/diseño de Nail Art.
- "nailsDetected": DEBE ser true si se aprecian uñas, manos o manicura visible en la imagen.
- "nailsDetected": DEBE ser false si la imagen es de cualquier otra cosa no relacionada con manicura o uñas (por ejemplo: paisajes, mascotas/animales, comida, automóviles, selfies de rostro sin manos visibles, ropa/calzado sin uñas, texto/documentos, objetos cotidianos sin manos, memes, etc.).
- "rejectionReason": Si nailsDetected es false, redacta una explicación breve, educada y profesional en español indicando qué parece haber en la imagen y por qué se requiere una foto de uñas (ej: "La imagen parece ser de un paisaje y no contiene manos ni uñas visibles para cotizar"). Si nailsDetected es true, déjalo como string vacío "".

SI SE DETECTAN UÑAS (nailsDetected = true), GENERA LA COTIZACIÓN COMPLETA:
1. "technique": Identifica la técnica base más adecuada (ej: "Soft Gel / Gel-X", "Manicura Rusa", "Acrílico Escultural", "Esmaltado Semipermanente", "Polygel Híbrido").
2. "recommendedService": Nombre comercial del servicio recomendado en nuestro salón.
3. "complexity": Clasifica la dificultad del arte: "Básico", "Intermedio", "Avanzado", o "Master 3D".
4. "detectedStyle": Breve descripción estilística.
5. "detectedColors": Lista de los 2 a 4 colores principales detectados en la foto.
6. "detectedShape": Forma visual sugerida en la foto: "Almendra", "Cuadrada", "Coffin", "Stiletto", "Ovalada", o "Natural".
7. "detectedLength": Largo sugerido en la foto: "Corto (S)", "Medio (M)", "Largo (L)", o "Extra Largo (XL)".
8. "detectedExtras": Lista de elementos o técnicas adicionales identificadas con costo estimado en MXN.
9. "estimatedDurationMinutes": Tiempo estimado total en cabina (entre 45 y 120 minutos).
10. "basePrice": Precio base de la estructura/manicura en MXN (ej: entre $420 y $890 MXN).
11. "artPrice": Precio acumulado del arte y decoración en MXN (ej: entre $100 y $450 MXN).
12. "totalEstimatedPrice": Suma total (basePrice + artPrice) en MXN.
13. "description": Explicación amigable en español dirigida a la clienta resumiendo lo que se identificó en su foto.
14. "stylistTip": Un consejo profesional de cuidado o recomendación de nuestras manicuristas master.

${userNotes ? `Notas adicionales de la clienta: "${userNotes}"` : ""}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];

    for (const modelName of candidateModels) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on model ${modelName}`)), 7500)
        );

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                nailsDetected: {
                  type: Type.BOOLEAN,
                  description: "True si la foto contiene uñas o manos visibles para manicura. False si es de otra cosa.",
                },
                rejectionReason: {
                  type: Type.STRING,
                  description: "Motivo amable si no se detectaron uñas.",
                },
                technique: { type: Type.STRING },
                recommendedService: { type: Type.STRING },
                complexity: {
                  type: Type.STRING,
                  enum: ["Básico", "Intermedio", "Avanzado", "Master 3D"],
                },
                detectedStyle: { type: Type.STRING },
                detectedColors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                detectedShape: {
                  type: Type.STRING,
                  enum: ["Almendra", "Cuadrada", "Coffin", "Stiletto", "Ovalada", "Natural"],
                },
                detectedLength: {
                  type: Type.STRING,
                  enum: ["Corto (S)", "Medio (M)", "Largo (L)", "Extra Largo (XL)"],
                },
                detectedExtras: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      estimatedCost: { type: Type.NUMBER },
                    },
                    required: ["name", "estimatedCost"],
                  },
                },
                estimatedDurationMinutes: { type: Type.NUMBER },
                basePrice: { type: Type.NUMBER },
                artPrice: { type: Type.NUMBER },
                totalEstimatedPrice: { type: Type.NUMBER },
                description: { type: Type.STRING },
                stylistTip: { type: Type.STRING },
              },
              required: [
                "nailsDetected",
                "technique",
                "recommendedService",
                "complexity",
                "detectedStyle",
                "detectedColors",
                "detectedShape",
                "detectedLength",
                "estimatedDurationMinutes",
                "basePrice",
                "artPrice",
                "totalEstimatedPrice",
                "description",
                "stylistTip",
              ],
            },
          },
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        const jsonText = response.text?.trim() || "{}";
        const parsed = JSON.parse(jsonText);
        return res.json(parsed);
      } catch (aiError: any) {
        // Try next candidate model on timeout, 503, high demand, or transient error
        continue;
      }
    }

    return res.json(getLocalNailAnalysisFallback(userNotes));
  } catch (error: any) {
    return res.json(getLocalNailAnalysisFallback(req.body?.userNotes));
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
      optimizeDeps: {
        force: true,
      },
    });
    app.use(vite.middlewares);

    // Fallback handler for all SPA routes in development to prevent 404s on direct navigation or refresh
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      // Pass through any API routes
      if (url.startsWith("/api")) {
        return next();
      }
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = await fs.promises.readFile(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EMME Nails Server with Gemini API running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
