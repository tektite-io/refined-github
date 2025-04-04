import {test, expect} from 'vitest';

import {parseConventionalCommit} from './conventional-commits.js';

test('parseConventionalCommit', () => {
	expect(parseConventionalCommit('fix: Commit message')).toMatchInlineSnapshot(`
		{
		  "raw": "fix: ",
		  "rawType": "fix",
		  "scope": undefined,
		  "type": "Fix",
		}
	`);
	expect(parseConventionalCommit('feat: Commit message')).toMatchInlineSnapshot(`
		{
		  "raw": "feat: ",
		  "rawType": "feat",
		  "scope": undefined,
		  "type": "Feature",
		}
	`);
	expect(parseConventionalCommit('fix!: Breaking change')).toMatchInlineSnapshot(`
		{
		  "raw": "fix!: ",
		  "rawType": "fix",
		  "scope": undefined,
		  "type": "Fix!",
		}
	`);
	expect(parseConventionalCommit('feat(scope): Commit message')).toMatchInlineSnapshot(`
		{
		  "raw": "feat(scope): ",
		  "rawType": "feat",
		  "scope": "scope: ",
		  "type": "Feature",
		}
	`);
	expect(parseConventionalCommit('feat(scope)!: Breaking change')).toMatchInlineSnapshot(`
		{
		  "raw": "feat(scope)!: ",
		  "rawType": "feat",
		  "scope": "scope: ",
		  "type": "Feature!",
		}
	`);
	expect(parseConventionalCommit('revert(scope): Revert "feat(scope): Commit message"')).toMatchInlineSnapshot(`
		{
		  "raw": "revert(scope): ",
		  "rawType": "revert",
		  "scope": "scope: ",
		  "type": "Revert",
		}
	`);
	expect(parseConventionalCommit('feat(sco pe): Commit message')).toMatchInlineSnapshot(`
		{
		  "raw": "feat(sco pe): ",
		  "rawType": "feat",
		  "scope": "sco pe: ",
		  "type": "Feature",
		}
	`);
	expect(parseConventionalCommit(('feat: Commit (message)'))).toMatchInlineSnapshot(`
		{
		  "raw": "feat: ",
		  "rawType": "feat",
		  "scope": undefined,
		  "type": "Feature",
		}
	`);
	expect(parseConventionalCommit('fix:')).toMatchInlineSnapshot(`
		{
		  "raw": "fix:",
		  "rawType": "fix",
		  "scope": undefined,
		  "type": "Fix",
		}
	`);

	expect(parseConventionalCommit('idk(label): not recognized')).toBeUndefined();
	expect(parseConventionalCommit('Commit message')).toBeUndefined();
	expect(parseConventionalCommit('feat(): Commit message')).toBeUndefined();
	expect(parseConventionalCommit('fe at(scope): Commit message) ')).toBeUndefined();
});
