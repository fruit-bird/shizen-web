import { redirect, type Actions } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from 'zod';

const loginSchema = z.object({
    username: z.string({ required_error: 'Username is required' }).trim(),
    password: z.string({ required_error: 'Password is required' })
});

export const load = async ({ locals }) => {
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/');
    }
    return { form: await superValidate(zod(loginSchema)) };
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(loginSchema));
        const usernameValid = await event.locals.pb.collection('users').getFirstListItem(`username="${form.data.username}"`).catch(() => undefined);
        if (!usernameValid) {
            return setError(form, 'username', 'Invalid username');
        }

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const validLogin = await event.locals.pb.collection('users').authWithPassword(form.data.username, form.data.password).catch(() => undefined);
            if (!validLogin) {
                return setError(form, 'password', 'Invalid password');
            }
        } catch (err) {
            return fail(400, { form });
        }
        throw redirect(303, '/');
    }
};