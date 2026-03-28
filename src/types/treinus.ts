export interface AthleteData {
  IdAthlete: number;
  IdTeam: number;
  Name: string;
  FirstName: string;
  LastName: string;
  PictureImageUrl: string | null;
  CoachName: string;
  CategoryName: string;
  BirthDate: string;
  Age: number;
  email: string;
}

export interface SmartItems {
  [key: string]: {
    IdSmartItemType: number;
    TypeName: string;
    Value: string;
    PictureImageUrl: string | null;
    VideoUrl: string | null;
    Name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface WorkoutStep {
  Id: number;
  Order: number;
  SegmentType: number; // Fundamental para identificar o tipo de esforço (1501, 1503, etc)
  SummaryText: string | null;
  DetailBriefing: string | null;
  Repetitions: number | null;

  // Métricas de Volume (Mínimos)
  TimeMin: number | null;
  TimeMinUnit: string | null;
  DistanceMin: number | null;
  DistanceMinUnit: string | null;

  // Métricas de Volume (Máximos - Usados no Conversor Zepp)
  TimeMax: number | null;
  TimeMaxUnit: string | null;
  DistanceMax: number | null;
  DistanceMaxUnit: string | null;

  // Intensidade e Alvos
  PaceMin: number | null;
  PaceMinUnit: string | null;
  PaceMax: number | null;
  PaceMaxUnit: string | null;
  Intensity: number | null; // IdItem que cruza com SmartItems
  IntensityType: number | null; // Usado para validar se existe alvo de intensidade

  // Estrutura Recursiva (CIRCLE no Zepp)
  Steps: WorkoutStep[];
}

export interface TreinusExercise {
  IdExercise: number;
  Date: string;
  TypeName: string;
  GenreName: string;
  Briefing: string | null;
  Distance: number | null;
  DistanceUnit: string | null;
  TimeMinAsString: string | null;
  TimeMaxAsString: string | null;
  Done: number;
  CourseTypeName: string | null;
  Intensity: number | null; // IdItem da Intensidade Geral
  Detail: {
    List: WorkoutStep[];
    Mode: number;
    Briefing: string | null;
  } | null;
}

/**
 * Interface para o Store de Sessão (Dados leves e persistentes)
 */
export interface TreinusSession {
  idTeam: number | null;
  idAthlete: number | null;
  smartItems: SmartItems | null;
  lastSync?: string | null;
}

/**
 * Interface para o Store de Planilha (Dados pesados e diários)
 */
export interface TreinusData {
  Athlete: AthleteData | null;
  PeriodizationView: {
    ExercisesPlan: TreinusExercise[];
  } | null;
}

/**
 * Tipo auxiliar para o retorno da Action unificada
 */
export interface TreinusFullDataResponse {
  idTeam: number | null;
  idAthlete: number | null;
  smartItems: SmartItems | null;
  exerciseSheet: TreinusData | null;
}