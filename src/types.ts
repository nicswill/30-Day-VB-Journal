export interface JournalDay {
  day: number;
  scripture: string;
  letsTalk: string;
  thinkAboutThis: string[];
  takeAction: string[];
  prayer: string;
}

export interface WeekIntro {
  weekNumber: number;
  theme: string;
  introduction: string;
}

export interface UserProgress {
  currentDay: number;
  journalEntries: {
    [key: number]: {
      thinkAboutThisResponses: string[];
      takeActionResponses: string[];
      completed: boolean;
    }
  };
}

export interface AuthUser {
  id: string;
  email: string;
}