import { error, type Actions } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from 'zod';

const profileFormSchema = z.object({
    username: z
        .string()
        .trim()
        .min(2, { message: 'Username must be at least 2 characters.' })
        .max(30, { message: 'Username must not be longer than 30 characters' })
        .optional(),
    motto: z.string().trim().max(50, { message: 'Motto must not exceed 50 characters.' }).optional(),
    bio: z.string().trim().max(200, { message: 'Bio must not exceed 200 characters.' }).optional(),
    avatar: z.any().optional(),
    // urls: z.array(z.string().url())
});

export const load = async () => {
    return { form: await superValidate(zod(profileFormSchema)) };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(profileFormSchema));
        const usernameTaken = await event.locals.pb.collection('users').getFirstListItem(`username="${form.data.username}"`).catch(() => undefined);
        if (usernameTaken) {
            return setError(form, 'username', 'Username already take.');
        }

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await event.locals.pb.collection('users').update(event.locals.user?.id, form.data);
        } catch (err) {
            throw error(400, 'Something went wrong updating your profile. Please try again.')
        }
        return { form };
    }
};
