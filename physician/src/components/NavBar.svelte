<script lang="ts">
  import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
  } from 'sveltestrap/src';
  import authStore from '../stores/authStore';
  import firebase from 'firebase/app';
  import pageTitleStore from '../stores/pageTitleStore';
  import navBarBackArrowStore from '../stores/navBarBackArrowStore';
  import transitionKeyStore from '../stores/transitionKeyStore';
  import { goto } from '$app/navigation';
  import currentPatientIdStore from '../stores/currentPatientIdStore';

  async function logout() {
    await firebase.auth().signOut();
  }
</script>

<Navbar color="light" light expand="md">
  <NavbarBrand href="/">
    {#if $navBarBackArrowStore.isVisible}
      <i class="fa-solid fa-arrow-left backarrow" on:click={() => {
        transitionKeyStore.set($transitionKeyStore + 1); 
        if ($navBarBackArrowStore.route === '/') {
          currentPatientIdStore.set(undefined);
          goto('/');
        } else {
          if (history?.back) {
            history.back();
          }
        }
      }}></i>
    {/if}
    {$pageTitleStore}
  </NavbarBrand>
  <Nav class="ms-auto" navbar>
    {#if $authStore.isLoggedIn}
      <NavItem>
        <NavLink on:click={logout}>Logout</NavLink>
      </NavItem>
    {/if}
  </Nav>
</Navbar>

<style>
</style>