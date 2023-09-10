import { writable } from "svelte/store";

export const currentTexture = writable<string>(undefined);