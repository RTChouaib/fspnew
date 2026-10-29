import test from 'node:test';
import assert from 'node:assert/strict';

import { TERMS } from '../data/terms';
import { buildQuestion, randomTerms, shuffle } from './quiz';

test('shuffle keeps all items and does not mutate the input', () => {
  const input = [1, 2, 3, 4, 5];
  const copy = [...input];
  const out = shuffle(input);
  assert.deepEqual(input, copy);
  assert.deepEqual([...out].sort(), copy);
});

test('randomTerms excludes the given ids and respects n', () => {
  const exclude = TERMS.slice(0, 10).map((t) => t.id);
  const out = randomTerms(TERMS, 20, exclude);
  assert.equal(out.length, 20);
  assert.ok(out.every((t) => !exclude.includes(t.id)));
});

test('every question has the correct answer among unique options', () => {
  const modes = ['medToPatient', 'patToMed', 'context'] as const;
  for (const term of TERMS) {
    for (const mode of modes) {
      const q = buildQuestion(term, mode, TERMS);
      assert.equal(q.termId, term.id);
      assert.ok(q.options.includes(q.correct), `${term.id}/${mode}: correct answer missing from options`);
      assert.ok(q.options.length >= 2, `${term.id}/${mode}: needs at least two options`);
      assert.equal(new Set(q.options).size, q.options.length, `${term.id}/${mode}: options must be unique`);
      assert.ok(q.explanation.length > 0);
    }
  }
});

test('term dataset has unique ids', () => {
  const ids = new Set(TERMS.map((t) => t.id));
  assert.equal(ids.size, TERMS.length);
});
