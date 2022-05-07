<script lang="ts">
  import type { MessageWithIdType } from "src/db";
  import {
    Row,
    Col
  } from 'sveltestrap/src';

  export let message: MessageWithIdType;

  function downloadURL(url: string, name: string) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const objectURL = window.URL.createObjectURL(xhr.response);
      const link = document.createElement('a');
      link.download = name;
      link.href = objectURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    xhr.open('GET', url, true);
    xhr.send();
  }

  const getDocumentName = () => {
    if (!message?.document) {
      return 'Something went wrong. Refresh the page please.';
    }
    const documentNameParts = message.document.split('-uniquesep-');
    let documentName = '';
    if (documentNameParts[1]) {
      documentName += documentNameParts[1];
    }
    if (documentNameParts[1] && documentNameParts[2]) {
      documentName += '.';
    }
    if (documentNameParts[2]) {
      documentName += documentNameParts[2];
    }
    return documentName;
  }

  $: documentName = message.type === 'image' || message.type === 'document' ? getDocumentName() : '';
</script>

<Row class="">
  <Col class="m-1">
    <div class="message-content border {!message.isPhysician ? 'border-success float-right' : 'border-physician float-left'} {message?.content?.length < 10 ? 'text-center' : 'text-justify'}">
      {#if message.type !== 'image' && message.type !== 'document'}
        {message.content}
      {:else if message.type === 'image' || message.type === 'document'}
        <div class="image-document-message-container">
          <i class="fa-solid fa-download download-icon" on:click={() => downloadURL(message.document, documentName)}></i>
          <span>
            {documentName}
          </span>
        </div>  
      {/if}
    </div>
  </Col>
</Row>

<style>
  div.float-right {
    float: right;
  }
  div.text-center {
    text-align: center;
  }
  div.text-justify {
    text-align: justify;
  }
  div.message-content {
    display: inline-block;
    padding: 0.3rem 0.7rem;
    box-sizing: border-box;
    min-width: 42px;
    border-radius: 1rem;
  }
  div.message-content.border-physician {
    border-color: #88000b !important;
  }
  div.message-content.float-right {
    border-bottom-right-radius: 0 !important;
  }
  div.message-content.float-left {
    border-bottom-left-radius: 0 !important;
  }
  i.download-icon {
    cursor: pointer;
  }
</style>