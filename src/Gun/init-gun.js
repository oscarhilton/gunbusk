const GUN_SERVER_URI = "http:localhost:8000/gun";
//Configure GUN to pass to streamer
var peers = [GUN_SERVER_URI];
var opt = { peers, localStorage: false, radisk: false };
export default Gun(opt);
