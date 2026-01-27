
export interface CulturalAdvice {
  title: string;
  steps: string[];
  taboo: string;
  phrase: {
    native: string;
    phonetic: string;
    meaning: string;
  };
}

export interface AppState {
  origin: string;
  destination: string;
  gender: string;
  scenario: string;
  isRecording: boolean;
  isLoading: boolean;
  result: CulturalAdvice | null;
  error: string | null;
}
