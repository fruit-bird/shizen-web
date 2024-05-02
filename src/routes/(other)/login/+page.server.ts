import { error, redirect, type Actions } from "@sveltejs/kit";
import z from 'zod';

const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const body = Object.fromEntries(await request.formData());
        const { username, password } = loginSchema.parse(body);

        try {
            await locals.pb.collection('users').authWithPassword(username as string, password as string);
            // if (!locals.pb?.authStore?.model?.verified) {
            //     locals.pb.authStore.clear();
            //     return { notVerified: true };
            // }
        } catch (err) {
            console.log('Login Error', err);
            throw error(500, 'Something went wrong');
        }
        throw redirect(303, '/');
    }
};