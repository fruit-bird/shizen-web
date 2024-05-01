import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';

// idk why errors persist, the code works fine
export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase("http://127.0.0.1:8090");
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    
    if (event.locals.pb.authStore.isValid) {
        event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
    } else {
        event.locals.user = undefined;
    }
    
    // console.log(event.locals);
    const response = await resolve(event);
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}

