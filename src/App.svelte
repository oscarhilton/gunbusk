<script>
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import { recordState } from './VideoStreaming/gun-recorder';

	import User from './User/user';

	export let gun;

	let map;
	let recording;
	let location;

	let videoReceiver;
	let videoSender;
	let user;
	
	onMount(async () => {
		// Start the users camera
		user = new User(gun, "TESTING_TESTING_123", videoReceiver, videoSender);
		const cam = await user.videoStream.gunRecorder.startCamera();
		// Set it to record
		user.videoStream.gunRecorder.record()
		// Set recording flag to state
		recording = user.videoStream.gunRecorder.recordState === recordState.RECORDING;
	})

	
	function createMap(container, initialView) {
	  let m = L.map(container, {preferCanvas: true }).setView(initialView, 14);
    L.tileLayer(
	    'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
	    {
	      subdomains: 'abcd',
	      maxZoom: 17,
	    }
	  ).addTo(m);

    return m;
  }
	function mapAction(container) {
		if (!user) return;
			user.location.getLocation((userLocation) => {
			const initialView = [userLocation.lat, userLocation.lng];
			map = createMap(container, initialView);
		
			return {
				destroy: () => {
					map.remove();
					map = null;
				}
			};
		});
	}
	function resizeMap() {
	  if(map) { map.invalidateSize(); }
  }

	// Users that are near appear on map

	// Users can add their own music
	

	// Users can add their own gigs


	// Users can see which gigs are closer to the map

	// Users can stream their gigs

	// SOLVED!



</script>
<svelte:window on:resize={resizeMap} />

<svelte:head>
<meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<main>
	<div class="video">
		<div class="recording banner"></div>
			<video class="video-dom" autoplay muted bind:this={videoSender}></video>
		<div class="thumb">
			<div class="live banner">live</div>
			<video class="video-dom" bind:this={videoReceiver} autoplay muted></video>
		</div>
	</div>
	<div class='controls'>
		<button class="record-button {recording ? 'record-button--recording' : 'record-button--stopped'}"></button>
	</div>
	{#if user}
	<div class="map" style="height:500px;width:100%" use:mapAction></div>
	{/if}
</main>

<style>

	:global(body) {
		padding: 0;
		margin: 0;
		background: #212121;
		min-height: 100vh;
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
		border-radius: 2% 2% 5% 5%;
	}

	.live {}

	.recording {
		border: solid thin rgba(255, 255, 255, 0.5);
	}
	.recording::after {
		content: '';
		width: 100%;
		height: 100%;
	}


	.video {
		position: relative;
		background: black;
		width: 100%;
		height: 80vh;
		border-radius: 0 0 5% 5%;
		overflow: hidden;
	}

	.video-dom {
		width: 100%;
		height: 100%;
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
		height: 20vh;
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