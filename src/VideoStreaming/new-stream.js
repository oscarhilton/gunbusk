import { MIMETYPE_VIDEO_AUDIO } from './video-audio-types';
import GunRecorder from "./gun-recorder";
import GunStreamer from "./gun-streamer";
import GunViewer from "./gun-viewer";

export default class NewStream {
	constructor(gunInstance, pubKey, senderVideoDom, receiverVideoDom) {
		this.gunInstance = gunInstance;
		this.cameraOptions = {
			video: {
				width: 320,
				height: 280,
				facingMode: "environment",
				frameRate: 24
			},
			audio: true
		};
    this.pubKey = pubKey;
		this.senderVideoDom = senderVideoDom;
		this.receiverVideoDom = receiverVideoDom;
    this.recordState = null;

		this.initViewer(MIMETYPE_VIDEO_AUDIO);
		this.initStreamer();
		this.initRecorder(MIMETYPE_VIDEO_AUDIO);
	}

	initViewer(mimeType) {
		//Configure GunViewer
		var viewer_config = {
			mimeType,
			streamerId: this.senderVideoDom, //HTML ID of the streamer
			catchup: false, //Skip to last frame when there is to much loading. Set to false to increase smooth playback but with latency
			debug: false //For debug logs
		};

		this.gunViewer = new GunViewer(viewer_config);

		// Get data from gun and pass along to viewer
		this.gunInstance
			.get(this.pubKey)
			.on((data) => this.gunViewer.onStreamerData(data));
	}

	initStreamer() {
		//Config for the GUN GunStreamer
		var streamer_config = {
			dbRecord: "gunmeeting", //The root of the streams
			streamId: this.pubKey, //The user id you wanna stream
			gun: this.gunInstance, //Gun instance
			debug: false, //For debug logs
			onStreamerData: this.gunViewer.onStreamerData, //If you want manually handle the data manually
			url: "https://cdn.jsdelivr.net/gh/QVDev/GunStreamer@0.0.9/js/parser_worker.js" //webworker load remote
		};

		//GUN Streamer is the data side. It will convert data and write to GUN db
		this.gunStreamer = new GunStreamer(streamer_config);
	}

	initRecorder(mimeType) {
		const recorder_config = {
			mimeType,
			video_id: this.receiverVideoDom, //Video html element id
			onDataAvailable: this.gunStreamer.onDataAvailable, //MediaRecorder data available callback
			onRecordStateChange: this.onRecordStateChange, //Callback for recording state
			// audioBitsPerSecond: 6000,//Audio bits per second this is the lowest quality
			// videoBitsPerSecond: 100000,//Video bits per second this is the lowest quality
			recordInterval: 800, //Interval of the recorder higher will increase delay but more buffering. Lower will not do much. Due limitiation of webm
			cameraOptions: this.cameraOptions, //The camera and screencast options see constant
			// experimental: true,//This is custom time interval and very unstable with audio. Only video is more stable is interval quick enough? Audio
			debug: true //For debug logs
		};

		//Init the recorder
		this.gunRecorder = new GunRecorder(recorder_config);
	}

	onRecordStateChange(state) {
    this.recordState = state;
  };
}
