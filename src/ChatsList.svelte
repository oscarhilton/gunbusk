<script>
  import { onMount } from 'svelte'
  import { gun } from './gun/init-gun'
  import ChatRoom from './ChatRoom.svelte'

  let chats = {}

  onMount(() => {
    gun
      .user()
      .get("chats").map().on((chat, key) => {
        function IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        if (IsJsonString(chat)) {
          chats[key] = JSON.parse(chat)
        } else {
          delete chats[key];
        }
      })
  })

  $: chatsList = Object.entries(chats)
</script>

<div>
  <ul>
    {#each chatsList as [key, chat]}
    <li key={key}>
        {#if chat.roomId}
          <ChatRoom chat={chat} />
        {/if}
      </li>
    {/each}
  </ul>
</div>