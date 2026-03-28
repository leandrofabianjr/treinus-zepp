import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = "https://webapp.treinus.com.br";

/**
 * Função Recursiva para expandir strings JSON aninhadas
 */
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
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return deepParse(JSON.parse(trimmed));
      } catch {
        return obj;
      }
    }
  }
  return obj;
}

/**
 * Extrai dados do script externo (formato var x = [...])
 */
function extrairSmartItems(scriptContent: string) {
  const regex = /var\s+(\w+)\s*=\s*(\[[\s\S]*?\]|\{[\s\S]*?\})(?:;|<)/;
  const match = scriptContent.match(regex);

  if (!match || !match[1] || !match[2]) {
    throw new Error('Nenhum JSON encontrado na estrutura var do SmartItems');
  }

  return {
    varName: match[1],
    data: deepParse(JSON.parse(match[2]))
  };
}

/**
 * Extrai dados do Controller inline (Base64)
 */
function extrairDadosController(htmlContent: string) {
  const teamMatch = htmlContent.match(/idTeam\s*:\s*(\d+)/);
  const athleteMatch = htmlContent.match(/idAthlete\s*:\s*(\d+)/);
  const dataMatch = htmlContent.match(/data\s*:\s*["']([^"']+)["']/);

  if (!dataMatch || !dataMatch[1]) {
    throw new Error("Atributo 'data' (Base64) não encontrado no HTML.");
  }

  const base64String = dataMatch[1];
  const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');

  return {
    idTeam: teamMatch ? parseInt(teamMatch[1]) : null,
    idAthlete: athleteMatch ? parseInt(athleteMatch[1]) : null,
    exerciseSheet: deepParse(JSON.parse(decodedString))
  };
}

/**
 * Função Principal de busca de dados
 */
export async function getTreinusData() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  // 1. Gerar data atual
  const today = new Date().toISOString().split('T')[0];
  const pageUrl = `${BASE_URL}/Athlete/ExerciseSheet/Index?area=dashboard&Date=${today}`;

  try {
    // 2. Buscar o HTML da página do Dashboard
    const pageResponse = await axios.get(pageUrl, {
      headers: {
        "Cookie": allCookies,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const html = pageResponse.data;

    // 3. Extrair Dados do Controller (Base64 no HTML)
    const controllerData = extrairDadosController(html);

    // 4. Buscar os SmartItems (Script Externo)
    const scriptRegex = /src="(\/Athlete\/ExerciseSheet\/SmartItems\?lastupdate=[^"]+)"/;
    const scriptMatch = html.match(scriptRegex);

    let smartItemsData = null;
    if (scriptMatch && scriptMatch[1]) {
      const scriptUrl = `${BASE_URL}${scriptMatch[1]}`;
      const scriptResponse = await axios.get(scriptUrl, {
        headers: { "Cookie": allCookies }
      });
      smartItemsData = extrairSmartItems(scriptResponse.data);
    }

    return {
      ...controllerData,
      smartItems: smartItemsData?.data || null
    };

  } catch (error) {
    console.error("Erro ao buscar dados do Treinus:", error);
    return null;
  }
}