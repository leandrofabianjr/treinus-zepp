import axios from "axios";
import { cookies } from "next/headers";

const LOGIN_URL = "https://webapp.treinus.com.br/Default.aspx";

export async function executeTreinusLogin({ email, password }: { email: string, password: string }) {
  // 1. GET inicial para pegar os tokens de estado (VIEWSTATE)
  const getResponse = await axios.get(LOGIN_URL);
  const html = getResponse.data;

  const viewState = html.match(/id="__VIEWSTATE" value="([^"]+)"/)?.[1];
  const viewStateGen = html.match(/id="__VIEWSTATEGENERATOR" value="([^"]+)"/)?.[1];

  if (!viewState || !viewStateGen) {
    throw new Error("Não foi possível encontrar os tokens de sessão (ViewState).");
  }

  // 2. Preparar o corpo da requisição
  const params = new URLSearchParams();
  params.append("__EVENTTARGET", "");
  params.append("__EVENTARGUMENT", "");
  params.append("__VIEWSTATE", viewState);
  params.append("__VIEWSTATEGENERATOR", viewStateGen);
  params.append("ctl00$ctl00$ctl00$FormContent$FormContent$body$LoginControl1$LoginUser$UserName", email);
  params.append("ctl00$ctl00$ctl00$FormContent$FormContent$body$LoginControl1$LoginUser$Password", password);
  params.append("ctl00$ctl00$ctl00$FormContent$FormContent$body$LoginControl1$LoginUser$RememberMe", "U");
  params.append("ctl00$ctl00$ctl00$FormContent$FormContent$body$LoginControl1$LoginUser$LoginButton", "Entrar");

  // 3. POST para realizar o login
  try {
    const response = await axios.post(LOGIN_URL, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": LOGIN_URL,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      await saveCookiesToStore(setCookieHeader);
      return true;
    }

    return false;
  } catch (error) {
    // Tratamento específico para o redirect 302 do ASP.NET que o Axios considera erro
    if (axios.isAxiosError(error) && error.response?.status === 302) {
      const setCookieHeader = error.response.headers["set-cookie"];
      if (setCookieHeader) {
        await saveCookiesToStore(setCookieHeader);
        return true;
      }
    }
    throw error;
  }
}

// Função auxiliar interna para processar os cookies no Next.js
async function saveCookiesToStore(setCookieHeader: string[]) {
  const cookieStore = await cookies();
  setCookieHeader.forEach(cookieString => {
    const [fullCookie] = cookieString.split(';');
    const [name, value] = fullCookie.split('=');
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  });
}

export async function executeTreinusLogout() {
  const cookieStore = await cookies();

  // Lista os nomes dos cookies que o Treinus costuma usar
  // Adicione aqui outros que você identificar no seu console log
  const cookiesToClear = [".ASPXAUTH", "ASP.NET_SessionId", "Treinus_Session"];

  cookiesToClear.forEach(cookieName => {
    cookieStore.delete(cookieName);
  });
}

export async function isTreinusAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.has('.ASPXAUTH');
}