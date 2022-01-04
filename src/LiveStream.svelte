<script>
	import { onMount, onDestroy } from 'svelte';
	import { recordState } from './VideoStreaming/gun-recorder';
	import MediaQuery from './mediaQuery.svelte'

	export let client;

	let recording;

	let videoReceiver;
	let videoSender;
	
	onMount(async () => {
		// Start the users camera
    client.initVideo(videoSender, videoReceiver);
	})
</script>


<MediaQuery query="(max-width: 480px)" let:matches>
  {#if matches}
  <div class="video">
    <div class="recording banner"></div>
      <video class="video-dom video-dom--mobile" autoplay muted bind:this={videoReceiver}></video>
    <div class="thumb">
      <div class="live banner">live</div>
      <video class="video-dom video-dom--mobile" bind:this={videoSender} autoplay muted></video>
    </div>
  </div>
  <div class='controls'>
    <button class="record-button {recording ? 'record-button--recording' : 'record-button--stopped'}"></button>
  </div>
  {:else}
  <div class="flex-grid">
    <div class="flex-grid-cell flex-grid-sm">
      this is a sidebar
    </div>
    <div class="flex-grid-cell flex-grid-lg">
      <div class="video">
        <div class="recording banner"></div>
          <video class="video-dom" autoplay muted bind:this={videoReceiver}></video>
        <div class="thumb">
          <div class="live banner">live</div>
          <video class="video-dom" bind:this={videoSender} autoplay muted></video>
        </div>
      </div>
      <button class="record-button {recording ? 'record-button--recording' : 'record-button--stopped'}"></button>
    </div>
    <div class="flex-grid-cell flex-grid-sm">
      this is a sidebar
    </div>
  </div>
	{/if}
</MediaQuery>




<style>

  .flex-grid {
    width: 100%;
    display: flex;
  }

  .flex-grid-cell {
    display: block;
  }

  .flex-grid-sm {
    width: 15%;
  }
  .flex-grid-lg {
    width: 70%;
  }

	.banner {
		position: absolute;
		top: 2%;
		left: 2%;
		bottom: 2%;
		right: 2%;
		color: white;
		text-transform: uppercase;
		font-size: 11px;
		border-radius: 2%;
	}

	.video {
		position: relative;
		background: black;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

  .video--mobile {
    width: 100%;
		height: 100%;
  }

	.video-dom {
		width: 100%;
		height: 100%;
	}

  .video-dom--mobile {
		object-fit: cover;
  }

	.record-button {
		position: relative;
		width: 80px;
		height: 80px;
		background: rgba(0, 0, 0, 0.5);
		border: none;
		border-radius: 50%;
	}

	.record-button::after {
		content: '';
		width: 40%;
		height: 40%;
		background: red;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 50%;
	}

	.record-button::before {
		content: '';
		width: 80%;
		height: 80%;
		border: solid 2px rgba(255, 255, 255, 0.2);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 50%;
	}

	.record-button--recording::before {
		border: solid 2px rgba(255, 0, 0, 0.2);
	}

	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 20%;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.thumb {
		position: absolute;
		bottom: 5%;
		right: 5%;
		background: black;
		width: 100px;
		height: 80px;
		overflow: hidden;
		opacity: 0.5;
	}

	.map {
		border-radius: 15px;
	}
</style>