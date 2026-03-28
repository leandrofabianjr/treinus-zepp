'use server';

export async function createZeppGistAction(workoutId: string, data: any) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return { success: false, error: 'Configuração do GitHub ausente no servidor.' };
  }

  const fileName = `zepp-workout-${workoutId}.json`;

  try {
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify({
        description: `[Treinus-Zepp-App] Treino: ${data.title} - ID: ${workoutId}`,
        public: false, // "Secret Gists" são acessíveis por quem tem o link
        files: {
          [fileName]: {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    });

    const gist = await response.json();

    if (!response.ok) throw new Error(gist.message || 'Erro ao criar Gist');

    // Retornamos a URL RAW do arquivo, que é o que a API da Zepp precisa
    const rawUrl = gist.files[fileName].raw_url;

    return {
      success: true,
      url: rawUrl
    };
  } catch (error: any) {
    console.error('Erro Gist:', error);
    return { success: false, error: error.message };
  }
}