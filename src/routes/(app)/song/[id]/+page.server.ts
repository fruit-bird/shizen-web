import { fail } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const { id } = params;
    try {
        const song = await locals.pb.collection('songs').getOne(id, { expand: 'artists' });
        const artists = song.expand?.artists;
        const comments = await locals.pb
            .collection('song_comments')
            .getList(1, 20, {
                filter: `song="${song.id}"`,
                sort: '-created',
                expand: 'user'
            })
            .then((resultsList) => resultsList.items);

        return { song, artists, comments };
    } catch (err) {
        return fail(404); // Catches urls with invalid song ids
    }
};
