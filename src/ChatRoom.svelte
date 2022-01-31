<script>
  import { onMount } from 'svelte'
  import { gun, user } from './gun/init-gun';
  import ChatFeedMessage from './ChatFeedMessage.svelte';
  import ChatBubble from './ChatBubble.svelte';
  import UserLibrary from './user/UserLibrary';

  // Create a local store to cache data from GUN
  let messages = {}
  export let chat;

  let windowEl

  onMount(async () => {
    const { roomId, recipient } = chat

    let room = roomId

    if (!room) {
      await UserLibrary.createChat(recipient)
    }


    // Creates a listener that iterates over keys found in the "todo" node in GUN
    gun.user().get("messages").get(room).map().on(async (message, key) => {
      let userPair = await gun.user()._.sea;
      let friend = await gun.user(recipient);

      let decryptSecretFriend = await SEA.secret(friend.epub, userPair);
      let decryptedMessageFriend = await SEA.decrypt(message.toString(), decryptSecretFriend);

      if (decryptedMessageFriend) {
        // Updates the store with the new value
        messages[key] = decryptedMessageFriend
      } else {
        delete messages[key]
        messages = messages
      }
    })

  })
  

  
	// The below lines listens for updates in the store and creates
	// more convenient variables for use in markup
	$: messages = Object.entries(messages)
	// $: done = todos.filter(([key, todo]) => todo.done).length


  async function onSubmit(e) {
    if (!chat.roomId || !chat.pub) return console.log("OH NO", chat)
    const formData = new FormData(e.target);

    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    const { message } = data;
    await UserLibrary.sendMessage(chat.roomId, chat.pub, message, res => console.log(res))
  }	
</script>

<div class='container'>
  <div bind:this={windowEl} class='chat-window'>
    <ChatFeedMessage />
    {#each messages as [key, messageJSON]}
      <div class='chat-message'>
        <ChatBubble messageJSON={messageJSON} />
      </div>
    {/each}
  </div>
  <div>
    <div class='text-box'>
      <form on:submit|preventDefault={onSubmit}>
        <input 
          class="text-input" 
          type="text"
          id="message"
          name="message"
        />
        <button type="submit">Send!</button>
      </form>
    </div>
  </div>
</div>

<style>
  .container {
    margin: auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    background-color: rgba(0, 0, 0, 0.05);
  }
  .chat-window {
    height: 100%;
    overflow-y: auto;
    max-width: 1500px;
  }

  .chat-window--waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .text-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    position: relative;
    margin: 0;
    z-index: 2;
  }

  .image {
    width: 200px;
    height: 200px;
  }

  .image > svg {
    width: 100%;
    height: 100%;
  }

  .text-box {
    margin: 10px 0;
    padding: 20px;
    position: relative;
    display: flex;
    align-items: center;
  }

  .text-box::before {
    content: '';
    display: block;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    z-index: -1;
  } 
</style>