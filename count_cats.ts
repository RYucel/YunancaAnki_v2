import { flashcards, categories } from './src/data';
const counts = {};
flashcards.forEach(f => {
  counts[f.categoryId] = (counts[f.categoryId] || 0) + 1;
});
console.log('Categories in flashcards:');
console.log(counts);
const catIds = categories.map(c => c.id);
console.log('Categories defined in categories.ts:');
console.log(catIds);
