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

export interface UserProgress {
  [cardId: string]: CardKnowledgeStatus;
}
