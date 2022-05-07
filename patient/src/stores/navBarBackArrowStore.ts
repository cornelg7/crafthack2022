import { writable } from "svelte/store";

const navBarBackArrowStore = writable<boolean>(false);

export default {
  subscribe: navBarBackArrowStore.subscribe,
  set: navBarBackArrowStore.set,
};
