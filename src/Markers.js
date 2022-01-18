const marker = (
	vid = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  width = 150, height = 150,
) => `
  <div style="width:${width}px;height:${height}px;border-radius:50%;font-size:40px;display:flex;justify-content:center;align-items:center;">
    <video class="video-dom svelte-6ch5uo" autoplay="" controls="" preload="auto" src="${vid}" muted></video>
  </div>
`;
export default marker();