import LocationStream from "../LocationStreaming/index";
import VideoStream from '../VideoStreaming/new-stream';

export default class User {
  constructor(gun, pubKey, videoSend, videoReceive) {
    this.pubKey = pubKey

    this.location = new LocationStream(gun, this.pubKey);
    this.videoStream = new VideoStream(gun, pubKey, videoSend, videoReceive);
  }

  showLocation() {
    return {
      lat: this.location.latitude,
      long: this.location.longitude
    }
  }
}