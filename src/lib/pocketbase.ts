// User store for client side requests
import PocketBase, { type AuthModel } from "pocketbase";
import { writable, type Writable } from "svelte/store";

export const pb = new PocketBase("http://127.0.0.1:8090");
export const user: Writable<AuthModel> = writable(pb.authStore.model as AuthModel);

pb.authStore.onChange((auth) => {
    console.log("auth changed", auth);
    user.set(pb.authStore.model);
});
