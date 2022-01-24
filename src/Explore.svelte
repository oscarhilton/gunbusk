<script>
  import { onMount } from 'svelte'
  import EventAction from './EventAction.svelte'
  import { blur } from 'svelte/transition'
  import Map from './Map.svelte'
  import Chat from './ChatRoom.svelte';

  import Metaverse from './metaverse/index';

  let container

  onMount(async () => {
    const metav = await new Metaverse(container, 100000000, 100000000).init();
    console.log(metav, "<<");
  })


  export let chatReady = false;
  export let chatsList;
  export let messageList;
  export let sendMessage;
</script>

<div style="">
  <!-- <div class="container">
    <h1>Explore</h1>
    <div class="notice">
      <p>Eiusmod dolore doner consequat, non reprehenderit chuck brisket chislic irure.  Labore sunt turducken, culpa pork consequat porchetta ad excepteur kevin nisi.  Labore ball tip velit do, bacon chicken shoulder ex consectetur magna fugiat occaecat sunt corned beef meatloaf.  Strip steak pariatur incididunt capicola anim consectetur cillum doner nisi adipisicing aliquip turducken eiusmod sirloin.</p>
    </div>
  </div> -->
  <!-- <div style="height: 800px; margin-bottom: 30px; display: flex;"> -->
  <div>
    <!-- <div style="height: 100%; overflow-y: auto; border-radius:30px;overflow:hidden;margin:0 5px;">
      <Chat chatReady={chatReady} chatsList={chatsList} sendMessage={sendMessage} messageList={messageList} />
    </div> -->
    <!-- <div class="container" style="height: 500px">
      <Map />
    </div> -->
    <!-- <div style="height: 100%; overflow-y: auto; border-radius:30px;margin:0 5px;"> -->
    <div class="container">
      canvas
        <div bind:this={container} style="width: 100%; height: 100vh; border: solid thin black; overflow: hidden"></div>
        <!-- {#each [...Array(30).keys()] as i}
        <div transition:blur="{{amount: 10}}">
          <EventAction image={`https://picsum.photos/600/600?random=${i}`} title="Hello world" />
        </div>
        {/each} -->
    </div>
  </div>
</div>

<style>
  .notice {
    background: rgba(0, 100, 100, 0.1);
    padding: 20px 30px;
    line-height: 1.4;
    font-size: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.05);
    margin-bottom: 40px;
  }

  .container {
		max-width: 80%;
		margin: auto
	}
</style>