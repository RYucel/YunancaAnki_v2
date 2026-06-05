import { categories } from './data/categories';
import { basics } from './data/set_basics';
import { daily } from './data/set_daily';
import { life } from './data/set_life';
import { environment } from './data/set_environment';
import { grammar } from './data/set_grammar';
import { misc } from './data/set_misc';
import { extraVerbs } from './data/set_verbs2';
import { adjectives } from './data/set_adjectives';
import { advanced } from './data/set_advanced';
import { phrases } from './data/set_phrases';
import { expansion1 } from './data/set_expansion_1';
import { expansion2 } from './data/set_expansion_2';
import { expansion3 } from './data/set_expansion_3';
import { Flashcard } from './types';

export { categories };

export const flashcards: Flashcard[] = [
  ...basics,
  ...daily,
  ...life,
  ...environment,
  ...grammar,
  ...misc,
  ...extraVerbs,
  ...adjectives,
  ...advanced,
  ...phrases,
  ...expansion1,
  ...expansion2,
  ...expansion3
];
