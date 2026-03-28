import { SmartItems, WorkoutStep } from '@/types/treinus';

export interface ParsedStep {
  id: string;
  order: number;
  title: string;
  description: string;
  execution: string;
  subSteps?: ParsedStep[];
  isGroup: boolean;
  isRest: boolean; // Identificado via SegmentType ou Texto
}

export function parseWorkoutSteps(
  steps: WorkoutStep[],
  smartItems: SmartItems | null
): ParsedStep[] {
  if (!steps) return [];

  return steps.map((step) => {
    const isGroup = !!(step.Steps && step.Steps.length > 0);

    // Identificação de descanso: SegmentType 1510 (Recuperação) ou 1502 (Caminhada/Intervalo)
    // Ou se o texto de resumo explicitamente diz "Recuperar"
    const isRest =
      step.SegmentType === 1510 ||
      step.SegmentType === 1502 ||
      step.SummaryText?.toLowerCase().includes('recuperar') ||
      false;

    // 1. Tradução do Nome
    let exerciseName = step.SummaryText?.split('\r\n')[0] || "Exercício";

    if (smartItems && step.Intensity) {
      const si = smartItems[step.Intensity.toString()];
      if (si) exerciseName = si.Value || si.TypeName;
    }

    // 2. Execução (Volume e Intensidade)
    const executionParts: string[] = [];

    // Volume
    if (step.TimeMin) {
      const min = Math.floor(step.TimeMin / 60);
      const sec = Math.round(step.TimeMin % 60);
      executionParts.push(sec > 0 ? `${min}'${sec}"` : `${min}'`);
    } else if (step.DistanceMin) {
      const unit = step.DistanceMinUnit || 'm';
      executionParts.push(`${step.DistanceMin}${unit}`);
    }

    // Intensidade (Pace decimal -> mm:ss)
    if (step.PaceMin) {
      const totalSeconds = step.PaceMin * 60;
      const mm = Math.floor(totalSeconds);
      const ss = Math.round((totalSeconds - mm) * 60).toString().padStart(2, '0');
      executionParts.push(`@ ${mm}:${ss}/km`);
    }

    // 3. Título
    let title = `Passo ${step.Order}`;
    if (step.Repetitions && step.Repetitions > 1) {
      title = `Repetir ${step.Repetitions}x`;
    } else if (isRest) {
      title = "Recuperação";
    }

    return {
      id: `${step.Id}-${step.Order}-${step.SegmentType}`,
      order: step.Order,
      title,
      description: exerciseName,
      execution: executionParts.join(" "),
      isGroup,
      isRest,
      subSteps: isGroup ? parseWorkoutSteps(step.Steps, smartItems) : undefined
    };
  });
}