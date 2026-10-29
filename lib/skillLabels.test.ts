import test from 'node:test';
import assert from 'node:assert/strict';

import { skillLabel } from './skillLabels';

test('maps legacy snake_case keys to German labels', () => {
  assert.equal(skillLabel('patient_language'), 'Patientensprache');
  assert.equal(skillLabel('Terminology'), 'Fachbegriffe');
  assert.equal(skillLabel('anamnesis'), 'Anamnese');
});

test('keeps readable category names unchanged', () => {
  assert.equal(skillLabel('Herz & Kreislauf'), 'Herz & Kreislauf');
});

test('replaces underscores in unknown keys', () => {
  assert.equal(skillLabel('some_new_skill'), 'some new skill');
});
