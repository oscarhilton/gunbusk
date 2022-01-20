import { gun, user } from '../Gun/init-gun';
export default class LocationStream {
	constructor() {
		this.latitude = null;
		this.longitude = null;
		this.debug = true;
	}

	getLocation(callback) {
		if (!navigator.geolocation) {
			this.debugLog(
				"Geolocation is not supported by this browser. " + new Date().getTime()
			);
			return;
		}
    window.navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
      callback({ lat: coords.latitude, lng: coords.longitude });
      }, this.showError);
	}

	clearLocation() {
		this.latitude = null;
		this.longitude = null;
	}

	debugLog(logData) {
		if (this.debug) {
			console.log(logData);
		}
	}

	showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				this.debugLog("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				this.debugLog("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				this.debugLog("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				this.debugLog("An unknown error occurred.");
				break;
		}
	}
}