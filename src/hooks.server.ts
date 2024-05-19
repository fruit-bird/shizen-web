import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase("http://127.0.0.1:8090");
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    if (event.locals.pb.authStore.isValid) {
        event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
        event.locals.currentSongId = event.locals.pb.authStore.model?.currentSongId || 'ipyn2jk7018e447';
    } else {
        event.locals.user = undefined;
    }

    const response = await resolve(event);
    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

    return response;
}

