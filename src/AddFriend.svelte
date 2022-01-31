<script>
  import { onMount } from 'svelte'
  import UserLibrary from './user/UserLibrary';

  let publicKey;

  onMount(async () => {
    const certificate = await UserLibrary.generateFriendRequestsCertificate()
    console.log(certificate)
  })

  const handlePubkeyInput = (e) => publicKey = e.target.value;

  const handleFriendRequest = async (e) => {
    if (!publicKey.length) return;
      await UserLibrary.addFriendRequest(publicKey.trim())
  }
</script>

<div>
  <h4>Add a new friend request</h4>
  <form on:submit|preventDefault={handleFriendRequest}>
    <label>
      Public key
      <textarea on:input={handlePubkeyInput} />
    </label>
    <button type="submit">Submit</button>
  </form>
</div>