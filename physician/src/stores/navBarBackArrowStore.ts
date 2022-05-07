import { writable } from "svelte/store";

const navBarBackArrowStore = writable<{
  isVisible: boolean;
  route: string;
}>({
  isVisible: false,
  route: '/',
});

export default {
  subscribe: navBarBackArrowStore.subscribe,
  set: navBarBackArrowStore.set,
};
