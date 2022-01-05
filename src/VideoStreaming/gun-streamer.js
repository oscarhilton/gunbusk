import client from '../Torrents/client';

const RECORD_PREFIX = "GkXf";
var parseWorker;
var initialData;

export default class GunStreamer {
	constructor(config) {
		this.dbRecord = config.dbRecord;
		this.streamId = config.streamId;
		this.gunDB = config.gun;
		this.debug = config.debug;
		this.onStreamerData = config.onStreamerData;
		this.startWorker(config.url);
	}

	onDataAvailable(event) {
		if (event.data.size > 0) {
			var blob = event.data;

			var response = new Response(blob)
				.arrayBuffer()
				.then(function (arrayBuffer) {
					
					console.log(arrayBuffer)
					client.seedBuffer(arrayBuffer);

					blob = null;
					if (parseWorker != undefined) {
						parseWorker.postMessage(arrayBuffer);
					}
				});
			response = null;
		} else {
			gunStreamer.debugLog("data not available");
		}
	}

	startWorker(url) {
		if (typeof Worker !== "undefined") {
			if (typeof parseWorker == "undefined") {
				this.getRemoteWorker(url, (worker) => {
					parseWorker = worker;
					parseWorker.onmessage = (e) => {
						const message = e.data;
						this.writeToGun(message);
					};
				});
			}
		} else {
			gunStreamer.debugLog("Sorry! No Web Worker support.");
		}
	}

	getRemoteWorker(url, callback) {
		fetch(url)
			.then(function (response) {
				return response.text();
			})
			.then(function (js) {
				var workerSrcBlob, workerBlobURL;

				workerSrcBlob = new Blob([js], { type: "text/javascript" });
				workerBlobURL = window.URL.createObjectURL(workerSrcBlob);

				var worker = new Worker(workerBlobURL);
				callback(worker);
			});
	}

	stopWorker() {
		parseWorker.terminate();
		parseWorker = undefined;
	}

	writeToGun(base64data) {
		this.debugLog("Write to GUN::" + base64data.substring(0, 100));
		let lastUpdate = new Date().getTime();
		let user;
		if (initialData == undefined && base64data.startsWith(RECORD_PREFIX)) {
			this.debugLog("INITIAL");
			var n = base64data.indexOf("wIEB");
			this.debugLog("RAW::" + n + "::" + base64data.substring(0, 252));
			initialData = base64data.substring(0, 252);
		} else {
			var n = base64data.indexOf("H0O2dQH");
			this.debugLog("RAW::" + n + "::" + base64data);
		}
		if (this.gunDB) {
			//Probably has to be changed to different data structure
			user = this.gunDB
				.get(this.streamId)
				.put({
					initial: initialData,
					data: base64data,
					id: this.streamId,
					timestamp: lastUpdate,
					isSpeaking: false
				});
			this.gunDB.get(this.dbRecord).set(user);
		} else if (
			this.onStreamerData !== null &&
			this.onStreamerData !== undefined
		) {
			this.onStreamerData({
				initial: initialData,
				data: base64data,
				id: this.streamId,
				timestamp: lastUpdate,
				isSpeaking: false
			});
		}
	}

	debugLog(logData) {
		if (this.debug) {
			console.log(logData);
		}
	}
}
