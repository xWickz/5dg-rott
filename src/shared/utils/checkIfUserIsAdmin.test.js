import { expect, test } from 'vitest'
import { checkUserAdmin } from './checkIfUserIsAdmin.js'

test("Return a boolean based on comparing a string", async () => {
    const result = await checkUserAdmin();
    expect(result).toBe(false);
});
