<script>
  export let alias;
  export let pub;
  export let key;
  export let action;
  export let actionText;
</script>

<div class="user-tab">
  {alias}
  <button on:click={() => action(pub, key)}>{actionText}</button>
</div>

<style>
  .user-tab {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.03);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    font-size: 14px;
  }
</style>