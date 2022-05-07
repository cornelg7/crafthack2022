import { writable } from "svelte/store";

const pageTitleStore = writable<string>('Chat vs Cancer');

export default {
  subscribe: pageTitleStore.subscribe,
  set: pageTitleStore.set,
};
