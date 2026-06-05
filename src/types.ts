export interface Flashcard {
  id: string;
  categoryId: string;
  greek: string;
  pronunciation: string;
  turkish: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export type CardKnowledgeStatus = 'new' | 'learning' | 'mastered';

export interface CardProgress {
  status: CardKnowledgeStatus;
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: number; // Unix timestamp
}

export interface UserProgress {
  [cardId: string]: CardProgress | string; // Use union to support backward comp
}
