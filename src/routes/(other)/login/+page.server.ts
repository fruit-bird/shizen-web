import { error, redirect, type Actions } from "@sveltejs/kit";
import PocketBase from 'pocketbase';

export const actions: Actions = {
    login: async ({ locals, request }) => {
        const body = Object.fromEntries(await request.formData());
        console.log('thiccwhitebitches', body);

        try {
            await locals.pb.collection('users').authWithPassword(body.username, body.password);
            // if (!locals.pb?.authStore?.model?.verified) {
            //     locals.pb.authStore.clear();
            //     return { notVerified: true };
            // }
        } catch (err) {
            console.log('Error', err);
            throw error(500, 'Something went wrong');
        }
        throw redirect(303, '/');
    }
};