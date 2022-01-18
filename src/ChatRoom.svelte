<script>
  import { user } from './Gun/init-gun';
  import ChatFeedMessage from './ChatFeedMessage.svelte';
  import ChatBubble from './ChatBubble.svelte';

  export let chatReady = false;
  export let chatsList;
  export let messageList;
  export let sendMessage;
  
  let latestMessage;
  let publicKey;
  let roomId;
  let message = `HELLO WORLD !!! ${new Date()}`;

  let messages = {}

  chatsList.subscribe(({ latestMessage: l, pub: p, roomId: i }) => {
    latestMessage = l;
    publicKey = p;
    roomId = i;
    messageList(i, p).subscribe(message => {
      if (!message) return;
      if (!message.individual) return;
      const { content, id, sender, timeSent, type } = message.individual;
      const obj = { [timeSent]: { id, content, id, sender, timeSent, type } };
      Object.assign(messages, obj);
      messages = { ...messages, obj };
    });
    chatReady = true;
  });

  const sendNewMessage = (e) => {
    e.preventDefault();
    if (!roomId || !publicKey || !message) return;
    sendMessage(roomId, publicKey, message, res => console.log(res, "message result"));
  }
</script>

<div class='container'>
  <div class='chat-window chat-window--{chatReady ? 'ready' : 'waiting'}'>
    <ChatFeedMessage />
    {#each Object.values(messages) as { content, timeSent, sender, type, id }}
      <ChatBubble message={content} time={timeSent} isClient={sender === user.is.pub } name={sender} id={id} type={type} />
    {/each}
  </div>
  <div>
    <div class='text-box'>
      <form on:submit={sendNewMessage}>
        <input class="text-input" />
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