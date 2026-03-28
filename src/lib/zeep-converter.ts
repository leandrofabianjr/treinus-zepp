import { SmartItems, TreinusExercise, WorkoutStep } from '@/types/treinus';

// Ordem estrita de atributos exigida pelo Zepp para evitar erros de importação
const ZEPP_ATTR_SORT: Record<string, number> = {
  intervalType: 0,
  intervalUnit: 1,
  intervalUnitValue: 2,
  alertRule: 3,
  alertRuleDetail: 4,
  lengthUnit: 5,
  intervalDesc: 6,
  intervalTypeI18nKey: 7,
  intervalUnitI18nKey: 8,
  alertRuleI18nKey: 9,
  lengthUnitI18nKey: 10,
};

interface ZeppTrainingInterval {
  intervalType: string;
  intervalUnit: string;
  intervalUnitValue: string;
  alertRule: string;
  alertRuleDetail: string;
  lengthUnit: number;
  intervalDesc: string;
  intervalTypeI18nKey: string;
  intervalUnitI18nKey?: string;
  alertRuleI18nKey?: string;
  lengthUnitI18nKey: string;
}

interface ZeppCircle {
  type: 'CIRCLE';
  circleTimes: number;
  children: ZeppSegment[];
}

interface ZeppNode {
  type: 'NODE';
  trainingInterval: Partial<ZeppTrainingInterval>;
}

type ZeppSegment = ZeppCircle | ZeppNode;

interface ZeppTemplate {
  username: string;
  avatar: string;
  shareUrl: string;
  title: string;
  description: string;
  trainingIntervals: {
    type: 'PARENT';
    children: ZeppSegment[];
  };
  appName: string;
  createdAt: number;
  updatedAt: number;
  status: 'AVAILABLE';
  trainingTypeId: number;
  trainingTypeName: string;
}

/**
 * Ordena as chaves do objeto para o padrão Zepp sem perder a tipagem
 */
function sortZeppObject(obj: Partial<ZeppTrainingInterval>): Partial<ZeppTrainingInterval> {
  return Object.fromEntries(
    Object.entries(obj).sort(
      (a, b) => (ZEPP_ATTR_SORT[a[0]] ?? 99) - (ZEPP_ATTR_SORT[b[0]] ?? 99)
    )
  );
}

export function convertToZeppFormat(
  treino: TreinusExercise,
  smartItems: SmartItems | null,
): ZeppTemplate {

  const converterSegmento = (step: WorkoutStep): ZeppSegment => {
    // 1. Lógica de Repetições (CIRCLE)
    if (step.Repetitions && step.Repetitions > 1 && step.Steps && step.Steps.length > 0) {
      return {
        type: 'CIRCLE',
        circleTimes: step.Repetitions,
        children: step.Steps.map((subStep) => converterSegmento(subStep)),
      };
    }

    // 2. Definição Base do Nó (Inicia com campos obrigatórios)
    let interval: Partial<ZeppTrainingInterval> = {
      lengthUnit: 0,
      lengthUnitI18nKey: 'gap_metric',
    };

    // 3. Mapeamento de SegmentType
    const segmentConfigs: Record<number, Partial<ZeppTrainingInterval>> = {
      1501: { intervalType: '0', intervalTypeI18nKey: 'gapType_warmup' },
      1510: { intervalType: '3', intervalTypeI18nKey: 'gapType_recover' },
      1502: { intervalType: '3', intervalTypeI18nKey: 'gapType_recover' },
      1503: { intervalType: '1', intervalTypeI18nKey: 'gapType_training' },
      1506: { intervalType: '4', intervalTypeI18nKey: 'gapType_relax' },
    };

    interval = { ...interval, ...segmentConfigs[step.SegmentType] };

    // 4. Mapeamento de Duração (Tempo vs Distância)
    if (step.TimeMax && step.TimeMax > 0) {
      interval.intervalUnit = '1';
      interval.intervalUnitValue = Math.round(step.TimeMax).toString();
    } else if (step.DistanceMax && step.DistanceMax > 0) {
      let val = step.DistanceMax;
      if (step.DistanceMaxUnit === 'km') val = val * 1000;
      interval.intervalUnit = '0';
      interval.intervalUnitValue = Math.round(val).toString();
      interval.intervalUnitI18nKey = 'gap_Km';
    }

    // 5. Mapeamento de Intensidade (Zonas)
    const intensityConfigs: Record<number, Partial<ZeppTrainingInterval>> = {
      10007: { alertRule: '1', alertRuleDetail: '295-315', intervalDesc: 'Z1' },
      10008: { alertRule: '1', alertRuleDetail: '275-295', intervalDesc: 'Z2' },
      10009: { alertRule: '1', alertRuleDetail: '255-275', intervalDesc: 'Z3' },
      10010: { alertRule: '1', alertRuleDetail: '220-255', intervalDesc: 'Z4' },
    };

    if (step.Intensity && intensityConfigs[step.Intensity]) {
      interval = {
        ...interval,
        ...intensityConfigs[step.Intensity],
        alertRuleI18nKey: 'trainRemind_pace,,gap_Km',
      };
    } else if (step.DetailBriefing === 'TROTE') {
      interval = {
        ...interval,
        alertRule: '1',
        alertRuleDetail: '315-390',
        intervalDesc: 'Trote',
        alertRuleI18nKey: 'trainRemind_pace,,gap_Km',
      };
    } else if (step.SummaryText?.toUpperCase().includes('CAMINHA')) {
      interval = {
        ...interval,
        alertRule: '0',
        alertRuleDetail: '0-0',
        intervalDesc: 'Caminhada',
      };
    } else {
      interval.alertRule = '0';
      interval.alertRuleDetail = '0-0';
      interval.intervalDesc = step.SummaryText?.split('\r\n')[0] || 'Passo';
    }

    // Garantimos que o objeto final contenha todos os campos obrigatórios antes de ordenar
    const finalInterval = interval as ZeppTrainingInterval;

    return {
      type: 'NODE',
      trainingInterval: sortZeppObject(finalInterval),
    };
  };

  const exercicios = treino.Detail?.List.map((item) => converterSegmento(item)) || [];

  return {
    username: smartItems?.Athlete?.Name || 'Treinus',
    avatar: '',
    shareUrl: smartItems?.Athlete?.PictureImageUrl || 'https://img-cdn.zepp.com/20230911/outdoor.png',
    title: `${treino.Date.substring(2, 10)} ${treino.TypeName}`,
    description: treino.CourseTypeName || 'Plano',
    trainingIntervals: {
      type: 'PARENT',
      children: exercicios,
    },
    appName: 'com.xiaomi.hm.health',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: 'AVAILABLE',
    trainingTypeId: 1,
    trainingTypeName: '户外跑',
  };
}