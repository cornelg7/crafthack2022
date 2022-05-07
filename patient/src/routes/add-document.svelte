<script lang='ts'>
  import { goto } from '$app/navigation';
  import authStore from '../stores/authStore';
  import { Row, Col } from 'sveltestrap';
  import { createDocumentMessage } from '../db';
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
    document: yup
      .mixed()
      .required("Image or document required")
      // @ts-ignore
      .fileMax({
        maxBytes: 25000,
        message: "Max document size is 25MB",
      })
      .fileFormat({
        formats: ['image/jpg', 'image/png', 'image/jpeg', 'image/gif', 'text/plain', 'application/pdf'],
        message: `Any type of image is allowed.\nDocuments can only be Acrobat (.pdf),
                    Excel (.xls, xlsx),
                    Open Office (.odt),
                    PowerPoint (.ppt, .pptx),
                    Plain text (.txt),
                    Word (.doc, .docx),
                    Rich Text Format (.rtf)`,
      }),
  });

  const { form, errors, handleChange, handleSubmit, updateValidateField } =
    createForm({
      initialValues: {
        document: null,
      },
      validationSchema: schema,
      onSubmit: async (values) => {
        try {
          const messageRef = await createDocumentMessage(values, $authStore.user.uid);
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
  <Row class="my-3">
    <Col>
      <div class="mb-3">
        <Input
          on:change={(e) => {
            // @ts-ignore
            updateValidateField('document', e.target.files[0]);
          }}
          invalid={$errors.document.length > 0}
          type="file"
          name="document"
          id="document"
          placeholder="document"
          class="message-file h-100"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,image/*,.pdf,.rtf,.txt"
        />
        {#if $errors.document}
          <div class="invalid-feedback">{$errors.document}</div>
        {/if}
      </div>
    </Col>
  </Row>
  
  <Row class="flex-grow-1">
    <Col>
      <Button on:click={handleSubmit} class="w-100" color="success">Submit</Button
      >
    </Col>
  </Row>
  <!-- <Row>
    <h2>Form</h2>
    <pre>
      {JSON.stringify($form, null, 2)}
    </pre>
  </Row>
  <Row>
    <h2>Errors</h2>
    <pre>
      {JSON.stringify($errors, null, 2)}
    </pre>
  </Row> -->
{/if}

<style>
</style>