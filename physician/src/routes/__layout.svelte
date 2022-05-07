<script context="module" lang="ts">
  import { initFirebase } from '../initFirebase';

  export async function load({ url }) {
    await initFirebase();
    return {
      props: { url },
    };
  }
</script>

<script lang="ts">
  import { Container } from 'sveltestrap';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import { onMount } from 'svelte';
  import authStore from '../stores/authStore';
  import NavBar from '../components/NavBar.svelte';
  import PageTransition from '../components/PageTransition.svelte';

  onMount(() => {
    firebase.auth().onAuthStateChanged((user) => {
      authStore.set({
        isLoggedIn: user !== null,
        user,
      });
    });
  });
</script>

<div class="wrapper h-100 d-flex flex-column">
  <NavBar />
  <PageTransition>
    <Container class="h-100 flex-grow-1 d-flex flex-column overflow-hidden">
      <slot />
    </Container>
  </PageTransition>
</div>
