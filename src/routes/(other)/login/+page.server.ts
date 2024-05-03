import { redirect, type Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import z from 'zod';

const loginSchema = z.object({
    username: z.string({ required_error: 'Username is required' }).trim(),
    password: z.string({ required_error: 'Password is required' }),
});

export const load = async () => {
    return { form: await superValidate(zod(loginSchema)) };
}

export const actions: Actions = {
    login: async (event) => {
        if (event.locals.pb.authStore.isValid) {
            throw redirect(303, '/');
        }

        const form = await superValidate(event, zod(loginSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await event.locals.pb.collection('users').authWithPassword(form.data.username, form.data.password);
        } catch (err) {
            return fail(400, { form });
        }

        throw redirect(303, '/');
    }
};