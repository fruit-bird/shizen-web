// See https://kit.svelte.dev/docs/types#app

import type PocketBase from 'pocketbase';
import type { AuthModel } from 'pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: AuthModel | undefined;
			currentSongId: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
