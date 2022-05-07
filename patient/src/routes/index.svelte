<script lang='ts'>
  import { goto } from '$app/navigation';
  import authStore from '../stores/authStore';
  import { Row, Col } from 'sveltestrap';
  import { getMessage, getPatientDoc } from '../db';
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
    
  let div;
	let autoscroll;
  let messages: MessageWithIdType[] = [];
  
  pageTitleStore.set(`${Math.random() > 0.5 ? '👩‍🔬' : '👨‍🔬'} Chat with a physician`);
  navBarBackArrowStore.set(false);

  authStore.subscribe(async ({ isLoggedIn, user }) => {
    if (!isLoggedIn) {
      if (browser) {
        await goto('/login');
      }
    } else if (user?.uid) {
      const patientDocChange = await getPatientDoc(user.uid);
      patientDocChange?.onSnapshot(docSnapshot => {
        const patientData = docSnapshot.data() as PatientType;
        patientData.messages.forEach(async (messageRef: any) => {
          const message: MessageWithIdType = {
            ...(await getMessage(messageRef)).data(),
            id: messageRef.id,
          };
          if (!messages.map(msg => msg.id).includes(message.id)) {
            messages = [...messages, message];
          }
        });
      }, err => {
        console.log(`Encountered error: ${err}`);
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
      {#each messages as message}
        <Message {message} />
      {:else}
        <Row class="opacity-50">
          <Col class="text-center">
            No messages yet!
          </Col>
        </Row>
      {/each}
    </Col>
  </div>
  <hr>
  <Row>
    <Col class="text-center">
      Click on the buttons below to add a message
    </Col>
  </Row>
  <Row class="my-3">
    <div class="col-5">
      <Button on:click={() => { transitionKeyStore.set($transitionKeyStore + 1); goto('/add-message'); }} class="w-100" color="success">Text</Button>
    </div>
    <div class="col-7">
      <Button on:click={() => { transitionKeyStore.set($transitionKeyStore + 1); goto('/add-document'); }} class="w-100" color="success">Image / Document</Button>
    </div>
  </Row>
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
</style>
