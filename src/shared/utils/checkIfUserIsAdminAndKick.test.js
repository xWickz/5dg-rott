import { vi, test, expect, beforeEach } from 'vitest'

beforeEach(() => {
    vi.clearAllMocks();
});

vi.mock('@/router', () => ({
    default: { push: vi.fn() }
}));

// Creamos el objeto encadenable para supabase.from().select().eq().single()
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

import router from '@/router'
import { supabase } from '@/lib/supabaseClient'
import { checkUserAdmin } from './checkIfUserIsAdminAndKick.js'

test('Redirige si el usuario no es administrador', async() => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 1 } } });
    singleMock.mockResolvedValueOnce({ data: { role: 'user'}, error: null });

    await checkUserAdmin();
    expect(router.push).toHaveBeenCalledWith('/');
});

test('No redirige si el usuario es admin', async() => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 1 } } });
    singleMock.mockResolvedValueOnce({ data: { role: 'admin'}, error: null });

    await checkUserAdmin();
    expect(router.push).not.toHaveBeenCalled();
});
