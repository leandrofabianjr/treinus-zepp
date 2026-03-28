import { TreinusExercise, WorkoutStep, SmartItems } from '@/types/treinus';

/**
 * Converte pace decimal (ex: 4.249) para segundos totais (ex: 255)
 */
function paceToSeconds(paceDecimal: number | null): string {
  if (!paceDecimal) return "0";
  return Math.round(paceDecimal * 60).toString();
}

export function convertToZeppFormat(treino: TreinusExercise, smartItems: SmartItems | null, username: string) {
  const children: any[] = [];

  const processStep = (step: WorkoutStep) => {
    // Se for grupo (Repetir X vezes), o Zepp aceita aninhamento, 
    // mas o seu exemplo sugere uma estrutura linearizada para compatibilidade.
    if (step.Steps && step.Steps.length > 0) {
      step.Steps.forEach(sub => processStep(sub));
      return;
    }

    // Mapeamento de Tipos Zepp baseado no seu exemplo:
    // 0: warmup, 1: training, 3: recover, 4: relax
    let intervalType = "1";
    if (step.SegmentType === 1501) intervalType = "0";
    else if (step.SegmentType === 1510 || step.SegmentType === 1502) intervalType = "3";
    else if (step.SegmentType === 1506) intervalType = "4";

    const isDistance = !!step.DistanceMin;
    const unitValue = isDistance
      ? (step.DistanceMin! * (step.DistanceMinUnit === 'km' ? 1000 : 1)).toString()
      : (step.TimeMin || 0).toString();

    const hasPace = !!step.PaceMin;
    const alertRuleDetail = hasPace
      ? `${paceToSeconds(step.PaceMax)}-${paceToSeconds(step.PaceMin)}`
      : "0-0";

    children.push({
      type: "NODE",
      trainingInterval: {
        intervalType,
        intervalUnit: isDistance ? "0" : "1",
        intervalUnitValue: unitValue,
        alertRule: hasPace ? "1" : "0",
        alertRuleDetail,
        lengthUnit: 0,
        intervalDesc: step.SummaryText?.split('\r\n')[0] || "Passo",
        intervalTypeI18nKey: intervalType === "0" ? "gapType_warmup" : intervalType === "3" ? "gapType_recover" : intervalType === "4" ? "gapType_relax" : "gapType_training",
        lengthUnitI18nKey: "gap_metric"
      }
    });
  };

  treino.Detail?.List.forEach(step => processStep(step));

  return {
    username,
    avatar: "",
    shareUrl: "https://img-cdn.zepp.com/20230911/outdoor.png",
    title: `${treino.Date.substring(2, 10).replace(/-/g, '')} ${treino.TypeName}`,
    description: treino.CourseTypeName || "Plano",
    trainingIntervals: {
      type: "PARENT",
      children
    },
    appName: "com.xiaomi.hm.health",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: "AVAILABLE",
    trainingTypeId: 1,
    trainingTypeName: "户外跑"
  };
}