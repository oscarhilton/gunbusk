<script>
  import { onMount } from 'svelte'
  import UserTab from './UserTab.svelte'
  import { gun } from './gun/init-gun'
  import UserLibrary from './user/UserLibrary'

  let friendsList = {};
  
  onMount(async () => {
    gun.user().get('friends').map().on(async (pub, key) => {
      if (pub) {
        friendsList[key] = await gun.user(pub).once();
        await UserLibrary.createChatsCertificate(pub)
        await UserLibrary.createChat(pub)
      } else {
        delete friendsList[key]
      }
    })
  })

  $: fl = Object.entries(friendsList)

  const startChat = async (publicKey) => {
    try {
      await UserLibrary.createChat(publicKey)
    } catch(e) {
      console.log(e)
    }
    console.log("STARING CHAT ")
  }

</script>

<div class="container">
  <span class="title">Friends list</span>
  <ul>
  {#each fl as [key, friend]}
    <li key={key}>
      <UserTab alias={friend.alias} pub={friend.pub} key={key} action={() => startChat(friend.pub)} actionText={"action"} />
    </li>
  {/each}
  </ul>
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