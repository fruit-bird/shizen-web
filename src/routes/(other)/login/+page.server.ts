import { error, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const { username, password } = Object.fromEntries(await request.formData());

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