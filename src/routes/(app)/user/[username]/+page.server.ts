import { fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const { username } = params;
    try {
        const artist = await locals.pb.collection('users').getFirstListItem(`username="${username}"`);
        const songs = await locals.pb
            .collection('songs')
            .getList(1, 20, {
                filter: `artists.username?="${username}"`,
                sort: '-created',
                expand: 'artists'
            })
            .then((resultsList) => resultsList.items);

        return { artist, songs };
    } catch (err) {
        return fail(404); // Catches urls with invalid usernames
    }
};
