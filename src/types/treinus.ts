export interface SmartItems {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ExerciseData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TreinusExercise {
  IdExercise: number;
  IdPeriodization: number;
  IdPhase: number;
  IdMicro: number;
  IdType: number;
  TypeName: string;        // Ex: "Corrida", "Fortalecimento"
  IdGenre: number;
  GenreName: string;       // Ex: "Corrida", "Musculação"
  IdCourseType: number | null;
  CourseTypeName: string | null; // Ex: "Plano", "Montanha"

  Date: string;            // Formato ISO "2026-03-25T00:00:00"
  Briefing: string | null; // O texto principal com as orientações do treino
  Description: string | null;

  // Métricas de Volume
  Distance: number;        // Ex: 10
  DistanceUnit: string;    // Ex: "km"
  TimeMin: number;         // Minutos totais
  TimeMax: number;
  TimeMinAsString: string; // Ex: "01:00:00"
  TimeMaxAsString: string;

  // Intensidade e Esforço
  Intensity: string | null;
  EffortValue: number | null;
  EffortName: string | null;

  // Status de execução
  Done: number;            // 0 para não feito, 1 para feito
  IsRest: boolean;         // Se é dia de descanso (OFF)
  IsTest: boolean;         // Se é dia de teste/simulado

  // Outros IDs importantes
  IdTeam: number;
  IdAthlete: number;
  IdCoach: number;
  CoachName: string;
}

// Interface para a estrutura completa que salvamos no Zustand
export interface TreinusData {
  idTeam: number | null;
  idAthlete: number | null;
  exerciseSheet: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Athlete: any;
    PeriodizationView: {
      ExercisesPlan: TreinusExercise[];
    };
  } | null;
  smartItems: SmartItems | null;
}