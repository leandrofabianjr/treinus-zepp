# 🏃‍♂️ Treinus - Zepp

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GitHub Gists](https://img.shields.io/badge/GitHub_Gists-181717?style=for-the-badge&logo=github&logoColor=white)

> Uma ponte inteligente entre a sua planilha de treinos da **Treinus** e o seu relógio **Amazfit**, automatizando a criação de treinos estruturados no app **Zepp**.

## 🎯 O Problema
Muitos atletas utilizam a plataforma Treinus para receber orientações de seus treinadores, mas a exportação de treinos estruturados (com blocos de tiro, aquecimento e recuperação) para relógios Amazfit não é nativa. Criar manualmente cada passo no app Zepp é um processo lento e sujeito a erros.

## 🚀 A Solução
Este app automatiza todo o fluxo:
1. **Parser Inteligente**: Transforma a estrutura complexa e recursiva do JSON da Treinus em uma linha do tempo visual e técnica.
2. **Conversor Zepp**: Traduz métricas de corrida (Pace em min/km para segundos/km) e tipos de segmentos (aquecimento, treino, descanso) para o esquema oficial da Zepp.
3. **Integração Cloud**: Salva o treino estruturado em um **GitHub Gist Secret** para gerar uma URL pública estável.
4. **Deep Linking**: Gera um QR Code e um link direto que dispara o App Zepp no smartphone, já na tela de importação do treino.

## ✨ Funcionalidades Principais

-   **Dashboard de Treinos**: Visualização clara dos treinos planejados.
-   **Timeline Estruturada**: Renderização recursiva que suporta blocos complexos como *"Repetir 7x (200m Forte + 300m Trote)"*.
-   **Cálculo Automático de Alvos**: Conversão de zonas de intensidade (Z1, Z2, Z3...) em alertas de ritmo (Pace) no relógio.
-   **Modo Desktop & Mobile**: 
    -   No PC: Exibe um QR Code com a logo Zepp para scan rápido.
    -   No Smartphone: Botão "Abrir no App" via *custom URL scheme* (`amazfit://`).
-   **Gestor de Gists**: Página dedicada para listar e excluir os arquivos temporários criados no seu GitHub.

## 🛠️ Tecnologias

-   **Framework**: Next.js 14 (App Router)
-   **Linguagem**: TypeScript (Tipagem estrita para o protocolo Zepp)
-   **Estado**: Zustand com persistência local.
-   **Estilização**: Tailwind CSS & Lucide React Icons.
-   **Integração**: GitHub API (Gists).


## ⚙️ Configuração para Devs

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/treinus-zepp-sync.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```env
   GITHUB_TOKEN=seu_token_aqui
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---
Desenvolvido por **Leandro Fabian Jr.** 🚀🫂