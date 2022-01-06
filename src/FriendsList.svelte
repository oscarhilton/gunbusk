<script>
  import UserTab from './UserTab.svelte'

  export let friendsList;
  export let excludeFrom;
  export let action;
  export let actionText;
</script>

<div class="container">
  <span class="title">This is a title</span>
  {#if friendsList}
    {#each Object.keys(friendsList) as friend}
      {#if friend && !Object.keys(excludeFrom).includes(friend)}
        <UserTab alias={friendsList[friend].alias} pub={friendsList[friend].pub} action={action} actionText={actionText} />
      {/if}
    {/each}
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .title {
    display: block;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 150%;
    margin-bottom: 5px;
    border-bottom: solid thin rgba(0, 0, 0, 0.1);
    padding: 5px 0;
  }
</style>