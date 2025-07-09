import { expect, test, vi, beforeEach } from 'vitest'
import { checkUserAdmin } from './checkIfUserIsAdmin.js'
import { supabase } from '@/lib/supabaseClient'

const singleMock = vi.fn();
const chainMock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: singleMock 
};

vi.mock('@/lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn()
        },
        from: vi.fn(() => chainMock)
    }
}));

test("Retorna un booleano basado en comparación de string", async () => {

    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 1 } } });
    singleMock.mockResolvedValueOnce({ data: { role: 'user' }, error: null });

    const result = await checkUserAdmin();
    expect(result).toBe(false);
});

test("Retorna un booleano basado en comparación de string true", async () => {

    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 1 } } });
    singleMock.mockResolvedValueOnce({ data: { role: 'admin' }, error: null });

    const result = await checkUserAdmin();
    expect(result).toBe(true);
});
