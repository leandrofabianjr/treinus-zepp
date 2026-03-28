'use server';

const GITHUB_PREFIX = "[Treinus-Zepp-App]";

// Lista apenas os Gists criados por este app
export async function listMyAppGistsAction() {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch('https://api.github.com/gists', {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });

  if (!response.ok) return { success: false, error: 'Erro ao buscar Gists' };

  const gists = await response.json();

  // Filtra pela descrição
  const filtered = gists
    .filter((g: any) => g.description?.startsWith(GITHUB_PREFIX))
    .map((g: any) => ({
      id: g.id,
      description: g.description.replace(GITHUB_PREFIX, '').trim(),
      url: g.html_url,
      createdAt: g.created_at
    }));

  return { success: true, data: filtered };
}

// Exclui um Gist específico
export async function deleteGistAction(gistId: string) {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  return { success: response.status === 204 };
}