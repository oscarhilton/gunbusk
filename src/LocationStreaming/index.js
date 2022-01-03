export default class LocationStream {
	constructor(gun, streamId) {
		this.gunDB = gun;
		this.latitude = null;
		this.longitude = null;
		this.debug = true;
		this.streamId = streamId;
		this.dbRecord = 'location';
	}

	getLocation(callback) {
		if (!navigator.geolocation) {
			this.debugLog(
				"Geolocation is not supported by this browser. " + new Date().getTime()
			);
			return;
		}
    window.navigator.geolocation.getCurrentPosition(({ coords }) => {
      console.log(coords, "*****");
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
      this.submitToGun(coords);
      callback({ lat: coords.latitude, lng: coords.longitude });
      }, this.showError);
	}

	clearLocation() {
		this.latitude = null;
		this.longitude = null;
		this.submitToGun(null, null);
	}

	debugLog(logData) {
		if (this.debug) {
			console.log(logData);
		}
	}

	submitToGun({
    lat,
    long,
    accuracy,
    altitude,
    altitudeAccuracy,
    latitude,
    longitude,
    speed,
  }) {
		this.debugLog(
			"Write to GUN:: " + this.streamId,
			lat,
			long,
			accuracy,
			altitude,
			altitudeAccuracy,
			latitude,
			longitude,
			speed
		);
		let lastUpdate = new Date().getTime();

		const user = this.gunDB.get(this.streamId).put({
			id: this.streamId,
			timestamp: lastUpdate,
			lat,
			long,
			accuracy,
			altitude,
			altitudeAccuracy,
			latitude,
			longitude,
			speed
		});

		this.gunDB.get(this.dbRecord).set(user);
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