<script>
  import { onMount } from 'svelte';
  import Grid from "svelte-grid/src/index.svelte";
  import gridHelp from "svelte-grid/src/utils/helper.js";
  import { user } from './gun/init-gun'
  
  export let client;

  let pub;
  let loaded = false;
  let clientUploads;

  const cols = [[1100, 6]];
  const id = () => "_" + Math.random().toString(36).substr(2, 9);
  const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

  const COL = 6;

  const onChange = () => {
    updateProfile(items);
  };

  const reset = () => {
    items = layoutOriginal;
  };

  let layoutOriginal = [
    {
      [COL]: gridHelp.item({
        x: 2,
        y: 0,
        w: 2,
        h: 2,
        type: 'heading'
      }),
      id: id(),
    },
  ];

  let layout = layoutOriginal
  let items = layout;


  onMount(() => {
    client.isAuthenticated.subscribe(authed => {
      if (!authed) return console.warn("NOT AUTHED!");
      client.pub.subscribe(async (publicKey) => {
        if (!publicKey) return console.warn("NO PUB!")
        pub = publicKey
        const { uploads } = await client.getUploads(publicKey)
        const { json } = await client.getProfilePage(publicKey)
        clientUploads = uploads
        items = json
        loaded = true
      })
    });  
  })

  const handleUploadDetete = async (soul) => {
    if (!pub) return
    const res = await client.deleteProfileUpload(pub, soul)
    console.log(res);
  }

  const updateProfile = (profilePayload) => {
    if (!pub) return
    const payload = JSON.stringify({ payload: profilePayload });
    client.updateProfilePage(pub, payload, r => console.log(r))
  }

  window.$('html, #upload').upload(function resize(eve, up){
    if (!pub) return
    if(up){ return up.shrink(eve, resize, 1024) }
    var b64 = (eve.base64 || ((eve.event || eve).target || eve).result || eve); // which one? try all!
    client.addUploadToProfilePage(pub, b64, r => console.log(r))
  });

  items = layout


  function add({ text, upload }) {
    let newItem = {
      [COL]: gridHelp.item({
        w: Math.round(randomNumberInRange(1, 4)),
        h: Math.round(randomNumberInRange(1, 4)),
        x: 0,
        y: 0,
        text,
        upload: null,
        uploadSoul: upload,
      }),
      id: id(),
    };

    let findOutPosition = gridHelp.findSpace(newItem, items, COL);

    newItem = {
      ...newItem,
      [COL]: {
        ...newItem[COL],
        ...findOutPosition,
      },
    };

    items = [...items, ...[newItem]];
  }

</script>

<div class="page">
  {#if loaded}
    <div class="sidebar">
      BUTTONS

      <input id="upload" type="file" multiple>

      <ul>
        {#each clientUploads as upload}
          <li>
            <img class="upload" src={upload.b64} alt={upload.title} />
            <button on:click={() => handleUploadDetete(upload.soul)}>Delete</button>
            <button on:click={() => add({ text: upload.title, upload: upload.soul })}>Add</button>
          </li>
        {/each}
      </ul>
    </div>
    <div class="container">
      <Grid on:change={onChange} gap={[0, 0]} bind:items={items} rowHeight={100} let:item {cols} let:index fastStart>
        <div class="item">
          <div>
            {#if item.upload}
            <img src={item.upload.b64} alt={item.upload.title} />
            {/if}
          </div>
          <div class="help">
            <button>Remove</button>
          </div>
        </div>
      </Grid>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 100vw;
    max-height: 100vh;
    width: 100%;
    height: 100%;
    overflow: auto;
    margin: auto;
    background:rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
  }

  .container {
    width: 800px;
    height: 800px;
    margin: auto;
    overflow: auto;
    padding: 5px;
    background: white;
    border: solid thin rgba(0, 0, 0, 0);
    transition: border 0.1s;
  }

  .container:hover {
    border: solid thin rgba(0, 0, 0, 0.5);
  }

  .image {
    width: 100%;
  }
  .item {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: dashed thin rgba(0, 0, 0, 0.2);
    transition: border 0.2s;
    position: relative;
  }

  .item:hover {
    border: solid thin rgba(0, 0, 0, 0.4)
  }

  .help {
    opacity: 0;
    transition: opacity 0.2s;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .item:hover > .help {
    opacity: 1;
  }

  .sidebar {
    max-width: 400px;
  }

  .sidebar :global(.upload) {
    width: 100%;
  }

  .item :global(img) {
    width: 100%;
  }

</style>