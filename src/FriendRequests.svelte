<script>
  import UserTab from './UserTab.svelte'
  import { gun } from './gun/init-gun'
  import UserLibrary from './user/UserLibrary'

  let friendRequests = {};
  
	gun.user().get('friendRequests').map().on(async (publicKey, requestKey) => {
    if (!publicKey || !requestKey) return delete friendRequests[requestKey]
    const user = await gun.user(publicKey).once(r => r)
    if (!user) return
    const { pub, alias } = user
    if (!pub || !alias) return
    friendRequests[requestKey] = { pub, alias };
	})

  $: fr = Object.entries(friendRequests)

  const acceptFriendRequest = async (key, pub) => {
    console.log("ACCEPTING FR")
    try {
      await UserLibrary.acceptFriendRequest(key, pub)
    } catch (e) {
      console.log("ERROR")
      console.log(e)
    }
  }

</script>

<div class="container">
  <span class="title">Friend Requests</span>
  <ul>
    {JSON.stringify(fr)}
    {#each fr as [key, friend]}
      <li key={key}>
        <UserTab alias={friend.alias} pub={friend.pub} key={key} action={() => acceptFriendRequest(key, friend.pub)} actionText={"action"} />
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