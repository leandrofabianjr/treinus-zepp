'use client';

import { createZeppGistAction } from '@/actions/zepp';
import { ParsedStep, parseWorkoutSteps } from '@/lib/treinus-data-parser';
import { convertToZeppFormat } from '@/lib/zeep-converter';
import { useTreinusDataStore } from '@/store/useTreinusDataStore';
import { useTreinusSessionStore } from '@/store/useTreinusSessionStore';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Dumbbell,
  ListChecks,
  Loader2,
  Map,
  Repeat,
  Share2,
  Smartphone,
  Target,
  Timer,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

export default function TreinoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const periodizationView = useTreinusDataStore(
    (state) => state.PeriodizationView,
  );

  const exercisesPlan = React.useMemo(() => {
    return periodizationView?.ExercisesPlan || [];
  }, [periodizationView]);

  const smartItems = useTreinusSessionStore((state) => state.smartItems);

  const treino = React.useMemo(() => {
    if (!params.id) return null;
    return exercisesPlan.find((t) => t.IdExercise.toString() === params.id);
  }, [exercisesPlan, params.id]);

  /**
   * Resolve a Intensidade cruzando o ID do exercício com o dicionário de smartItems.
   * Ignora IntensityName (sempre null) e busca o Value ou TypeName mapeado.
   */
  const resolvedIntensity = React.useMemo(() => {
    if (!treino?.Intensity || !smartItems) return 'N/A';

    const intensityKey = treino.Intensity.toString();
    const item = smartItems[intensityKey];

    // Prioriza o 'Value' (Ex: "Z2 - LEVE/MODERADO") ou o 'TypeName'
    return item?.Value || item?.TypeName || 'Não definida';
  }, [treino, smartItems]);

  const etapas = React.useMemo(() => {
    if (!treino || !smartItems) return [];
    return parseWorkoutSteps(treino.Detail?.List || [], smartItems);
  }, [treino, smartItems]);

  const [gistUrl, setGistUrl] = React.useState<string | null>(null);
  const [zeppDeepLink, setZeppDeepLink] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleExportToZepp = async () => {
    if (!treino || !smartItems) return;
    setIsSaving(true);

    try {
      // 1. Converte o treino usando o parser que criamos
      const zeppData = convertToZeppFormat(treino, smartItems);

      // 2. Salva no GitHub Gist via Server Action
      const result = await createZeppGistAction(params.id as string, zeppData);

      if (result.success && result.url) {
        setGistUrl(result.url);

        // 3. Monta o link especial da API Zepp
        const deepLink = `https://api-mifit.zepp.com/v1/sport/shareTrainingTemplate/content?data=${encodeURIComponent(result.url)}&source=watch&name=trainingtemplate&target=share#/`;
        setZeppDeepLink(deepLink);
      } else {
        alert('Erro: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Erro crítico ao gerar integração.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!treino) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Treino não encontrado
        </h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
        >
          Voltar para Planilha
        </button>
      </div>
    );
  }

  const isRunning = treino.GenreName?.toLowerCase().includes('corrida');
  const accentColor = isRunning
    ? 'text-cyan-600 dark:text-cyan-400'
    : 'text-blue-600 dark:text-blue-400';
  const accentBg = isRunning
    ? 'bg-cyan-100 dark:bg-cyan-950/50'
    : 'bg-blue-100 dark:bg-blue-950/50';

  // Lógica de abertura inteligente (Mobile vs PC)
  const handleOpenZepp = (e: React.MouseEvent) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile && zeppDeepLink) {
      e.preventDefault();
      window.location.href = zeppDeepLink;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a lista
      </button>

      <header className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 ${accentBg} ${accentColor} text-[10px] font-black uppercase rounded-full tracking-widest`}
            >
              {treino.TypeName}
            </span>
            {treino.Done > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded-full tracking-widest">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
              {new Date(treino.Date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 leading-tight tracking-tight">
            {treino.CourseTypeName
              ? `${treino.TypeName}: ${treino.CourseTypeName}`
              : treino.TypeName}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <InfoTile
              icon={Map}
              label="Volume"
              value={
                (treino.Distance || 0) > 0
                  ? `${treino.Distance} ${treino.DistanceUnit}`
                  : 'N/A'
              }
              subValue="Distância prevista"
            />
            <InfoTile
              icon={Clock}
              label="Tempo"
              value={treino.TimeMinAsString || 'N/A'}
              subValue="Duração total"
            />
            <InfoTile
              icon={Target}
              label="Intensidade"
              value={resolvedIntensity}
              subValue="Baseado em SmartItems"
            />
            <InfoTile
              icon={Dumbbell}
              label="Modalidade"
              value={treino.GenreName || 'Geral'}
              subValue="Tipo de atividade"
            />
          </div>
        </div>
      </header>

      {treino.Briefing && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 px-2 flex items-center gap-2">
            Orientação Técnica
          </h2>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line shadow-inner">
            {treino.Briefing}
          </div>
        </section>
      )}

      {/* Seção de Exportação Zepp com QR Code */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl">
              <Share2 className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-white">Sincronizar com Amazfit</h3>
              <p className="text-xs text-zinc-500 font-medium tracking-wider">
                Adicionar o template de treino no Amazfit pelo App Zepp.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!gistUrl ? (
            <button
              onClick={handleExportToZepp}
              disabled={isSaving}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PREPARANDO DADOS DO TREINO...
                </>
              ) : (
                'GERAR LINK DE IMPORTAÇÃO'
              )}
            </button>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* QR Code para Scan no PC */}
              <div className="bg-white p-4 rounded-2xl shadow-inner shrink-0 group relative">
                <QRCodeSVG
                  value={zeppDeepLink || ''}
                  size={160}
                  level="H" // High error correction
                  includeMargin={false}
                  imageSettings={{
                    src: 'https://img-cdn.zepp.com/20230911/outdoor.png',
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <p className="text-[10px] font-black text-zinc-900 text-center px-2">
                    ESCANEIE COM A CÂMERA DO CELULAR
                  </p>
                </div>
              </div>

              {/* Ações e Links */}
              <div className="flex-grow space-y-4 w-full">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-300">
                    Link Gerado com Sucesso!
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Clique no botão abaixo se estiver no celular, ou aponte a
                    câmera para o QR Code ao lado.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <a
                    href={zeppDeepLink || '#'}
                    onClick={handleOpenZepp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-black hover:bg-zinc-200 transition-all active:scale-95"
                  >
                    <Smartphone className="w-5 h-5" />
                    ABRIR NO APP ZEPP
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
            <ListChecks className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Execução do Treino
          </h2>
        </div>

        {etapas.length > 0 ? (
          <div className="relative space-y-6 pl-4 md:pl-8 before:absolute before:inset-y-2 before:left-3 md:before:left-3 before:w-0.5 before:bg-zinc-200 before:dark:bg-zinc-800">
            {etapas.map((etapa: ParsedStep) => (
              <WorkoutStepRenderer
                key={etapa.id}
                etapa={etapa}
                isRunning={isRunning}
                accentBg={accentBg}
                accentColor={accentColor}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 italic font-medium">
            Este treino não possui divisões de etapas estruturadas na planilha.
          </div>
        )}
      </section>
    </div>
  );
}

function WorkoutStepRenderer({
  etapa,
  isRunning,
  accentBg,
  accentColor,
  depth = 0,
}: {
  etapa: ParsedStep;
  isRunning: boolean;
  accentBg: string;
  accentColor: string;
  depth?: number;
}) {
  // A lógica de isRest agora é centralizada no parser para evitar duplicação
  const isRest = etapa.isRest;

  return (
    <div className="relative flex flex-col gap-4 group animate-in fade-in duration-300">
      {/* Marcador da Timeline */}
      {depth === 0 && (
        <div
          className={`absolute -left-5 md:-left-8 flex items-center justify-center w-4 h-4 md:w-6 md:h-6 rounded-full border-2 z-10 transition-all
          ${
            isRest
              ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              : `bg-white dark:bg-zinc-950 ${isRunning ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]'}`
          }`}
        >
          {isRest ? (
            <Timer className="w-3 h-3 text-zinc-500" />
          ) : etapa.isGroup ? (
            <Repeat className="w-3 h-3 text-blue-500" />
          ) : null}
        </div>
      )}

      {/* Card da Etapa */}
      <div
        className={`flex-grow grid grid-cols-1 md:grid-cols-[140px_1fr_130px] gap-2 md:gap-4 items-center p-4 md:p-5 rounded-2xl border transition-all
        ${
          etapa.isGroup
            ? 'bg-blue-50/40 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
            : isRest
              ? 'bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-100 dark:border-zinc-800 opacity-75'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md'
        }`}
      >
        <span
          className={`text-[10px] font-black uppercase tracking-widest ${etapa.isGroup ? 'text-blue-600 dark:text-blue-400' : isRest ? 'text-zinc-400' : 'text-zinc-500'}`}
        >
          {etapa.title}
        </span>

        <p
          className={`font-bold text-base md:text-lg ${isRest ? 'text-zinc-500 italic' : 'text-zinc-900 dark:text-zinc-100'}`}
        >
          {etapa.description}
        </p>

        <div className="flex justify-start md:justify-end">
          {etapa.execution && (
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black font-mono tracking-tighter
              ${isRest ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500' : `${accentBg} ${accentColor} border border-current/10`}`}
            >
              {etapa.execution}
            </span>
          )}
        </div>
      </div>

      {/* Sub-etapas Recursivas */}
      {etapa.subSteps && etapa.subSteps.length > 0 && (
        <div className="ml-6 md:ml-12 pl-4 border-l-2 border-blue-100 dark:border-blue-900/30 space-y-4 py-2">
          {etapa.subSteps.map((sub) => (
            <WorkoutStepRenderer
              key={sub.id}
              etapa={sub}
              isRunning={isRunning}
              accentBg={accentBg}
              accentColor={accentColor}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <p
        className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none truncate pr-2"
        title={value}
      >
        {value}
      </p>
      <p className="text-[9px] text-zinc-500 dark:text-zinc-500 font-medium">
        {subValue}
      </p>
    </div>
  );
}
