<script lang="ts">
  import { Row, Col } from 'sveltestrap';
  import firebase from 'firebase/app';
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import authStore from '../stores/authStore';
  import { createPatient } from '../db';
  import pageTitleStore from '../stores/pageTitleStore';
  import navBarBackArrowStore from '../stores/navBarBackArrowStore';

  async function loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();

      await firebase.auth().signInWithPopup(provider);
    } catch (e) {
      console.log(e);
    }
  }
  
  pageTitleStore.set('💓 Chat vs Cancer');
  navBarBackArrowStore.set(false);

  const sub = authStore.subscribe(async (info) => {
    if (info.isLoggedIn) {
      // @ts-ignore
      if (info.user && info.user?.metadata?.creationTime === info.user?.metadata?.lastSignInTime) {
        // New user
        await createPatient(info.user.uid);
      }
      await goto('/');
    }
  });

  onDestroy(() => {
    sub();
  });
</script>

<Row class="flex-grow-1">
  <Col class="d-flex justify-content-center align-items-center">
    <img on:click={loginWithGoogle} src="/login-with-google.png" alt="Login With Google" class="mw-100" />
  </Col>
</Row>

<Row class="flex-grow-1"></Row>

<style>
  img {
    cursor: pointer;
  }
</style>
