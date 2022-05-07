import { writable } from "svelte/store";

const currentPatientIdStore = writable<string>(undefined);

export default {
  subscribe: currentPatientIdStore.subscribe,
  set: currentPatientIdStore.set,
};
