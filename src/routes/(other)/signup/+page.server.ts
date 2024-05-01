import { error, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    register: async ({ locals, request }) => {
        const body = Object.fromEntries(await request.formData());
        console.log('thiccwhitebitches', body);

        try {
            await locals.pb.collection('users').create({ ...body, name: body.username, emailVisibility: false });
            // await locals.pb.collection('users').requestVerification(body.email);
        } catch (err) {
            console.log('Error', err);
            throw error(500, 'Something went wrong');
        }
        throw redirect(303, '/login');
    }
};