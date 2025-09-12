import { GoogleGenAI, Type } from "@google/genai";
import { FormState, Report } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        probableDiagnosis: {
            type: Type.STRING,
            description: "Un diagnóstico detallado y técnico pero fácil de entender del problema probable del vehículo."
        },
        repairInstructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Una lista de instrucciones paso a paso para la reparación."
        },
        requiredParts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING }
                },
                required: ["name", "description"]
            },
            description: "Una lista de repuestos necesarios, con descripción y costo estimado en pesos chilenos (CLP)."
        },
        recommendedWorkshops: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ["name", "address"]
            },
            description: "Una lista de 2-3 talleres recomendados en la comuna especificada."
        },
        suggestedPartStores: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    address: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ["name", "address"]
            },
            description: "Una lista de 2-3 casas de repuestos recomendadas en la comuna especificada."
        }
    },
    required: ["probableDiagnosis", "repairInstructions", "requiredParts", "recommendedWorkshops", "suggestedPartStores"]
};

const buildPrompt = (formData: FormState): string => {
    return `
      Eres un experto mecánico automotriz y asistente de IA. Un usuario en Chile necesita un diagnóstico para su vehículo.
      Proporciona un informe detallado y profesional en formato JSON basado en la siguiente información.
      Sé específico con las recomendaciones para la ubicación proporcionada.

      **Información del Vehículo:**
      - Modelo: ${formData.model}
      - Año: ${formData.year}
      - Kilometraje: ${formData.mileage} km
      - Patente: ${formData.licensePlate || 'No proporcionada'}

      **Ubicación del Usuario:**
      - Región: ${formData.region}
      - Comuna: ${formData.comuna}

      **Descripción del Problema:**
      - Tipo de falla principal: ${formData.issueType}
      - ¿Cuándo ocurre el problema?: ${formData.q1}
      - ¿Hay ruidos o vibraciones extrañas?: ${formData.q2}
      - ¿Se encendió alguna luz de advertencia en el tablero?: ${formData.q3}
      - Comentarios adicionales: ${formData.comments || 'Ninguno'}

      **Tu Tarea:**
      Genera un informe de diagnóstico completo que incluya:
      1.  **Diagnóstico Probable:** Una explicación clara y técnica del problema más probable.
      2.  **Instrucciones de Reparación:** Pasos detallados para que un mecánico (o un usuario avanzado) pueda realizar la reparación.
      3.  **Repuestos Necesarios:** Una lista de piezas que probablemente se necesiten, con una breve descripción y un costo estimado en pesos chilenos (CLP).
      4.  **Talleres Recomendados:** Una lista de 2-3 talleres mecánicos con **nombres de fantasía (no reales)**, pero que suenen creíbles y estén relacionados con el rubro automotriz (ej: "Serviteca El Rápido", "Mecánica Confianza Total"). Para cada uno, inventa una dirección y un número de teléfono ficticios pero plausibles dentro de la **comuna de ${formData.comuna}, ${formData.region}**, y añade una razón para la recomendación.
      5.  **Casas de Repuestos Sugeridas:** Una lista de 2-3 tiendas de repuestos con **nombres de fantasía (no reales)**, pero creíbles (ej: "Repuestos El Perno Feliz", "AutoPartes Express Chile"). Para cada una, inventa una dirección y un número de teléfono ficticios pero plausibles dentro de la **comuna de ${formData.comuna}, ${formData.region}**.

      Responde únicamente con el objeto JSON que se ajusta al esquema proporcionado. No incluyas texto introductorio, explicaciones adicionales ni la sintaxis de markdown para JSON.
    `;
};


export const generateDiagnosticReport = async (formData: FormState): Promise<Report> => {
    try {
        const prompt = buildPrompt(formData);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const reportData: Report = JSON.parse(jsonText);
        
        return reportData;

    } catch (error) {
        console.error("Error generating report with Gemini:", error);
        throw new Error("Failed to generate diagnostic report.");
    }
};