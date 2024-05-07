import { redirect, type Actions } from "@sveltejs/kit";
import { setError, fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from 'zod';
import type { PageServerLoad } from "./$types";

const signupSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .trim()
        .min(1, { message: 'Username is required' })
        .max(40, { message: 'Username is too long' }),
    email: z
        .string({ required_error: 'Email is required' })
        .min(1, { message: 'Email is required' })
        .max(200, { message: 'Email is too long' })
        .email({ message: 'Invalid email' }),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirm: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),
}).superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['password']
        });
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['passwordConfirm']
        });
    }
});

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.pb.authStore.isValid) {
        throw redirect(303, '/');
    }
    return { form: await superValidate(zod(signupSchema)) };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(signupSchema));
        const usernameTaken = await event.locals.pb.collection('users').getFirstListItem(`username="${form.data.username}"`).catch(() => undefined);
        if (usernameTaken) {
            return setError(form, 'username', 'Username already exists');
        }
        // should check for email taken, normal check does not work, idk why

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await event.locals.pb.collection('users').create({ ...form.data, displayName: form.data.username, emailVisibility: false });
            await event.locals.pb.collection('users').requestVerification(form.data.email);
            await event.locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
        } catch (err) {
            return fail(500, { form });
        }
        throw redirect(303, '/');
    }
};
