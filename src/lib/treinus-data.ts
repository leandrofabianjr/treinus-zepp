import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = "https://webapp.treinus.com.br";

export async function getExerciseSheetData() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  // 1. Gerar data atual no formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const pageUrl = `${BASE_URL}/Athlete/ExerciseSheet/Index?area=dashboard&Date=${today}`;

  try {
    // 2. Buscar o HTML da página do Dashboard
    const pageResponse = await axios.get(pageUrl, {
      headers: {
        "Cookie": allCookies,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."
      }
    });

    const html = pageResponse.data;

    // 3. Extrair a URL do script via Regex
    // Procura por: /Athlete/ExerciseSheet/SmartItems?lastupdate=...&id=...
    const scriptRegex = /src="(\/Athlete\/ExerciseSheet\/SmartItems\?lastupdate=[^"]+)"/;
    const match = html.match(scriptRegex);

    if (!match || !match[1]) {
      throw new Error("Script de SmartItems não encontrado no HTML.");
    }

    const scriptUrl = `${BASE_URL}${match[1]}`;

    // 4. Baixar o conteúdo do arquivo .js
    const scriptResponse = await axios.get(scriptUrl, {
      headers: { "Cookie": allCookies }
    });

    // 5. Aplicar sua lógica de conversão
    const [varName, jsonData] = extrairEConverterTudo(scriptResponse.data);

    return { varName, jsonData };

  } catch (error) {
    console.error("Erro ao buscar planilha de exercícios:", error);
    return null;
  }
}

// Sua função de conversão (mantida igual à sua lógica)
function extrairEConverterTudo(htmlContent: string) {
  const regex = /var\s+(\w+)\s*=\s*(\[[\s\S]*?\]|\{[\s\S]*?\})(?:;|<)/;
  const match = htmlContent.match(regex);

  if (!match || !match[1] || !match[2]) {
    throw new Error('Nenhum JSON encontrado na estrutura var = ...');
  }

  const jsonInicial = JSON.parse(match[2]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function deepParse(obj: any): any {
    if (Array.isArray(obj)) return obj.map((item) => deepParse(item));
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = deepParse(obj[key]);
      }
      return obj;
    }
    if (typeof obj === 'string') {
      const trimmed = obj.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          return deepParse(JSON.parse(obj));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return obj;
        }
      }
    }
    return obj;
  }

  return [match[1], deepParse(jsonInicial)];
}