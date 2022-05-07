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

  async function logout() {
    await firebase.auth().signOut();
  }
</script>

<Navbar color="light" light expand="md">
  <NavbarBrand href="/">
    {#if $navBarBackArrowStore}
      <i class="fa-solid fa-arrow-left backarrow" on:click={() => { transitionKeyStore.set($transitionKeyStore + 1); goto('/') }}></i>
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