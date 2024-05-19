import { error, type Actions } from "@sveltejs/kit";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from 'zod';

const accountFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }).optional(),
    // password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
});

export const load = async () => {
    return { form: await superValidate(zod(accountFormSchema)) };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(accountFormSchema));
        const emailTaken = await event.locals.pb.collection('users').getFirstListItem(`email="${form.data.email}"`).catch(() => undefined);
        if (emailTaken) {
            return setError(form, 'email', 'Email already taken.');
        }

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await event.locals.pb.collection('users').update(event.locals.user?.id, form.data);
        } catch (err) {
            throw error(400, 'Something went wrong updating your account. Please try again.')
        }
        return { form };
    }
};