<script>
  import { fade } from 'svelte/transition'
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import ImKey from 'svelte-icons-pack/im/ImKey';

  export let title;
  export let image;

  let text = 'Eiusmod dolore doner Kevin sed andouille in dolor rump.'
</script>

<div class="event">
  <img transition:fade class="image" src={image} alt="foobar" />
  <!-- <img transition:fade class="image" style="max-width: 50%; magin: auto" src={"https://int.nyt.com/data/int-shared/nytdocs/docs/291/pages/291-p3-normal.gif"} alt="foobar" /> -->
  <span>{text}</span>
</div>

<style>
  .event {
    background: white;
    overflow: hidden;
    /* margin-bottom: 10px; */
    position: relative;
    overflow: hidden;
  }

  .event > span {
    font-size: 10px;
    padding: 5px;
    display: block;
    background-color: #eeeeee;
    transition: all 0.1s;
    transform: translateY(0);
    position: absolute;
  }

  .event:hover > span {
    transform: translateY(-100%);
  }

  .container {
    position: relative;
    padding: 5px;
  }

  .image {
    width: 100%;
    vertical-align: bottom;
    /* padding: 10px 0 30% 0; */
  }

  .actions {
    position: absolute;
    top: calc(-8px - 10px);
    display: flex;
    justify-content: flex-end;
    width: calc(100% - 40px);
  }

  .actions > button {
    border-radius: 50px;
    height: 40px;
    width: 40px;
    margin-left: 5px;
    background: white;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .description {
    font-size: 12px;
  }
</style>