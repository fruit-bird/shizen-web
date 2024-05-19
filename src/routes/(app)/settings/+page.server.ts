import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    // The `load` in +layout.server.ts only runs once when we enter the /settings route.
    // Thus we have to check if the user is logged in whenever we enter a nested settings page.
    if (!locals.pb.authStore.isValid) {
        throw redirect(303, "/login");
    }
    throw redirect(303, "/settings/profile");
};
