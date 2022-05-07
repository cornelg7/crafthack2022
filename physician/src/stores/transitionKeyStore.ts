import { writable } from "svelte/store";

const transitionKeyStore = writable<number>(0);

export default {
  subscribe: transitionKeyStore.subscribe,
  set: transitionKeyStore.set,
};
