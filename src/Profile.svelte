<script>
  import { onMount } from 'svelte';
  import Grid from "svelte-grid/src/index.svelte";
  import gridHelp from "svelte-grid/src/utils/helper.js";
  import { user } from './Gun/init-gun'

export let client;

let pub;
let loaded = false;

const id = () => "_" + Math.random().toString(36).substr(2, 9);

const COL = 10;

const onChange = () => {
  updateProfile(items);
};

const reset = () => {
  items = layoutOriginal;
};

let layoutOriginal = [
  {
    [COL]: gridHelp.item({
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: id(),
  },
  {
    [COL]: gridHelp.item({
      x: 4,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: id(),
  },
  {
    [COL]: gridHelp.item({
      x: 6,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: id(),
  },
  {
    [COL]: gridHelp.item({
      x: 0,
      y: 0,
      w: 2,
      h: 2,
    }),
    id: id(),
  },

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

const cols = [
  [ 1100, 10 ],
];


onMount(() => {
  client.isAuthenticated.subscribe(authed => {
    if (!authed) return console.warn("NOT AUTHED!");
    client.pub.subscribe(publicKey => {
      if (!publicKey) return console.warn("NO PUB!")
      pub = publicKey
      client.getProfilePage(publicKey, ({ json }) => {
        items = json.payload
        loaded = true
      })
    })
  });  
})

const updateProfile = (profilePayload) => {
  if (!pub) return
  const payload = JSON.stringify({ payload: profilePayload });
  client.updateProfilePage(pub, payload, r => console.log(r))
}


items = layout

</script>

<div class="page">
  {#if loaded}
    <div class="container">
      <Grid on:change={onChange} gap={[0, 0]} bind:items={items} rowHeight={100} let:item {cols} let:index fastStart>
        <div class="item">
          {#if item.type === 'heading'}
            <h1>Hello world!</h1>
          {:else}
            <p>I'm a cool cat!</p>
          {/if}
          {index}
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
  }

  .container {
    max-width: 1400px;
    max-height: 800px;
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

  .item {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: dashed thin rgba(0, 0, 0, 0.2);
    transition: border 0.2s;
  }

  .item:hover {
    border: solid thin rgba(0, 0, 0, 0.4)
  }
</style>