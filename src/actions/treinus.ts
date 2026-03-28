"use server";

import { getTreinusData } from "@/lib/treinus-data";
import { executeTreinusLogin, executeTreinusLogout } from "@/lib/treinus-login";
import { redirect } from "next/navigation";

export async function loginTreinusAction({ email, password }: { email: string, password: string }) {
  let success = false;

  try {
    success = await executeTreinusLogin({ email, password });
  } catch (error) {
    console.error("Erro no login Treinus:", error);
    throw new Error("Falha na autenticação. Verifique suas credenciais.");
  }

  if (success) {
    redirect('/dashboard');
  }
}

export async function logoutTreinusAction() {
  await executeTreinusLogout();

  redirect("/login");
}

export async function fetchTreinusData() {
  try {
    const data = await getTreinusData();
    if (!data) throw new Error("Sessão expirada");
    return { success: true, data: data };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, error: "Unauthorized" };
  }
}

