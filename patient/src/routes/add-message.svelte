<script lang='ts'>
  import { goto } from '$app/navigation';
  import authStore from '../stores/authStore';
  import { Row, Col } from 'sveltestrap';
  import { createTextMessage } from '../db';
  import * as yup from 'yup';
  import '../yup';
  import { createForm } from 'svelte-forms-lib';
  import {
    Button,
    Input,
  } from "sveltestrap/src";
  import { browser } from '$app/env';
  import pageTitleStore from '../stores/pageTitleStore';
  import navBarBackArrowStore from '../stores/navBarBackArrowStore';
  import transitionKeyStore from '../stores/transitionKeyStore';

  authStore.subscribe(async ({ isLoggedIn }) => {
    if (!isLoggedIn) {
      if (browser) {
        await goto('/login');
      }
    }
  });

  pageTitleStore.set('Add a text message');
  navBarBackArrowStore.set(true);

  const schema = yup.object().shape({
    message: yup.string().required('The message is required').max(5000),
  });

  const { form, errors, handleChange, handleSubmit, updateValidateField } =
    createForm({
      initialValues: {
        message: '',
      },
      validationSchema: schema,
      onSubmit: async (values) => {
        try {
          const messageRef = await createTextMessage(values, $authStore.user.uid);
          transitionKeyStore.set($transitionKeyStore + 1);
          goto('/');
        } catch (e) {
          console.log('error saving');
          console.log(e);
        }
      },
    });

</script>

{#if $authStore.isLoggedIn}
  <Row class="flex-grow-1 my-3">
    <Col>
      <div class="mb-3 h-100">
        <Input
          on:change={handleChange}
          bind:value={$form.message}
          invalid={$errors.message.length > 0}
          type="textarea"
          name="message"
          id="message"
          placeholder="Message"
          class="message-textarea h-100"
        />
        {#if $errors.message}
          <div class="invalid-feedback">{$errors.message}</div>
        {/if}
      </div>
    </Col>
  </Row>
  
  <Row class="flex-grow-1 mt-3">
    <Col>
      <Button on:click={handleSubmit} class="w-100" color="success">Submit</Button
      >
    </Col>
  </Row>
{/if}

<style>
  input[type="textarea"] {
    resize: none;
  }
</style>