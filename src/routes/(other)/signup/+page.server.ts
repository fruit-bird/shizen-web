import { error, redirect, type Actions } from "@sveltejs/kit";
import z from 'zod';

const signupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
});

export const actions: Actions = {
    register: async ({ locals, request }) => {
        if (locals.pb.authStore.isValid) {
            throw redirect(303, '/');
        }

        const body = Object.fromEntries(await request.formData());

        try {
            const validatedForm = signupSchema.parse(body);
            const usernameTaken = await locals.pb
                .collection('users')
                .getFirstListItem(`username="${validatedForm.username}"`)
                .catch(() => undefined);

            if (!usernameTaken) {
                await locals.pb.collection('users').create({
                    ...validatedForm,
                    name: validatedForm.username as string,
                    emailVisibility: false
                });
                await locals.pb.collection('users').requestVerification(validatedForm.email as string);
            }
        } catch (err) {
            console.log('Error', err);
            throw error(500, 'Something went wrong');
        }
        throw redirect(303, '/login');
    }
};