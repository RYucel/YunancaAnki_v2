import { categories } from './data/categories';
import { basics } from './data/set_basics';
import { daily } from './data/set_daily';
import { life } from './data/set_life';
import { environment } from './data/set_environment';
import { grammar } from './data/set_grammar';
import { misc } from './data/set_misc';
import { Flashcard } from './types';

export { categories };

export const flashcards: Flashcard[] = [
  ...basics,
  ...daily,
  ...life,
  ...environment,
  ...grammar,
  ...misc
];
