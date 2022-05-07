<script>
  import transitionKeyStore from "../stores/transitionKeyStore";
  import { fade } from "svelte/transition";
  const pageTransitionDuration = 700;
</script>

{#key $transitionKeyStore}
  <div  class="h-100 flex-grow-1 overflow-hidden"
        in:fade={{ duration: pageTransitionDuration, delay: pageTransitionDuration / 2 }}>
  <slot />
</div>
{/key}