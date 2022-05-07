<script lang='ts'>
  import { goto } from '$app/navigation';
  import authStore from '../stores/authStore';
  import { Row, Col } from 'sveltestrap';
  import { getAllPatientDocs, getMessage, getPatientDoc } from '../db';
  import type { PatientType, MessageWithIdType } from '../db';
  import {
    Button,
  } from "sveltestrap/src";
  import { browser } from '$app/env';
  import pageTitleStore from '../stores/pageTitleStore';
  import navBarBackArrowStore from '../stores/navBarBackArrowStore';
  import Message from '../components/Message.svelte';
	import { beforeUpdate, afterUpdate } from 'svelte';
  import transitionKeyStore from '../stores/transitionKeyStore';
  import currentPatientIdStore from '../stores/currentPatientIdStore';

  let div;
	let autoscroll;
  let patientIds = [];
  
  pageTitleStore.set(`${Math.random() > 0.5 ? '👩‍🔬' : '👨‍🔬'} Select a patient to chat`);
  navBarBackArrowStore.set({isVisible: false, route: '/'});

  authStore.subscribe(async ({ isLoggedIn, user }) => {
    if (!isLoggedIn) {
      if (browser) {
        await goto('/login');
      }
    } else if (user?.uid) {
      const patientDocs = await getAllPatientDocs();
      patientDocs.forEach(doc => {
        if (!patientIds.includes(doc.id)) {
          patientIds = [...patientIds, doc.id];
        }
      });
    }
  });

	beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
	});

	afterUpdate(() => {
		if (autoscroll) {
      div?.scrollTo(0, div?.scrollHeight);
    }
	});
</script>

{#if $authStore.isLoggedIn}
  <div class="row flex-grow-1 scrollable-chat" bind:this={div}>
    <Col class="pt-2">
      {#each patientIds as patientId}
        <hr>
        <div class="row">
          <div class="col" on:click={() => {currentPatientIdStore.set(patientId); transitionKeyStore.set($transitionKeyStore + 1); goto('/chat');}}>
            {patientId}
            <i class="fa-solid fa-angle-right patient-right-arrow-icon"></i>
          </div>
        </div>
      {:else}
        <Row class="opacity-50">
          <Col class="text-center">
            No patients available.
          </Col>
        </Row>
      {/each}
      <hr>
    </Col>
  </div>
{/if}

<style>
  div.scrollable-chat {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  /* Scroll bar */
  /* Width */
  div.scrollable-chat::-webkit-scrollbar {
    width: 6px;
  }
  /* Track */
  div.scrollable-chat::-webkit-scrollbar-track {
    background: #f2f2f2; 
  }
  /* Handle */
  div.scrollable-chat::-webkit-scrollbar-thumb {
    background: rgb(184, 184, 184);
  }
  div.scrollable-chat::-webkit-scrollbar-thumb:hover {
    background: #797979; 
  }
  i.patient-right-arrow-icon {
    float: right;
  }
</style>
