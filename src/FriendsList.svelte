<script>
  import UserTab from './UserTab.svelte'
  import { gun } from './gun/init-gun'

  let friendsList = {};
  
	gun.user().get('friends').map().on(async (pub, key) => {
    if (pub) {
      friendsList[key] = await gun.user(pub).once();
    } else {
      delete friendsList[key]
    }
	})

  $: fl = Object.entries(friendsList)

</script>

<div class="container">
  <span class="title">Friends list</span>
  {#each fl as [key, friend]}
    <UserTab alias={friend.alias} pub={friend.pub} key={friend.key} action={() => {}} actionText={"action"} />
  {/each}
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