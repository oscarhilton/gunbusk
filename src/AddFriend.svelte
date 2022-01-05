<script>
  export let client;

  let publicKey;

  const handlePubkeyInput = (e) => publicKey = e.target.value;
  const handleFriendRequest = (e) => {
    e.preventDefault();
    if (!publicKey.length) return;
      client.generateFriendRequestsCertificate(res => {
        console.log(res);
      })
      client.addFriendRequest(publicKey.trim(), res2 => {
        console.log(res2)
      })
  }
</script>

<div>
  <h4>Add a new friend request</h4>
  <form on:submit={handleFriendRequest}>
    <label>
      Public key
      <textarea class="foo" on:input={handlePubkeyInput} />
    </label>
    <button type="submit">Submit</button>
  </form>
</div>