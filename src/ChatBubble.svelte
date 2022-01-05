<script>
  export let message;
  export let time = 'a moment ago'
  export let isClient = Math.random() > 0.4;
</script>

<div class="container">
  <span class="time">{time}</span>
  <div class="aligner aligner--{isClient ? 'client' : 'other'}">
    <div class="message message--{isClient ? 'client' : 'other'}">
      {message}
    </div>
  </div>
</div>

<style>
  .container {
    margin: 10px 30px;
    font-size: 10px;
  }

  .aligner {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
  }

  .aligner--client {
    justify-content: flex-end;
  }

  .aligner--other {
    justify-content: flex-start;
  }

  .time {
    margin-left: 16px;
    opacity: 0.1;
    margin-bottom: 5px;
    display: block;
  }

  .message {
    padding: 15px 20px 10px 20px;
    background: #1d1d1d;
    /* box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.2); */
    border-radius: 20px 20px 20px 0;
    color: #cccccc;
    display: block;
    line-height: 1.6;
    font-size: 14px;
    max-width: 400px;
  }

  .message--client {
    background-color: #3a3a3a;
    justify-self: flex-end;
    border-radius: 20px 20px 0 20px;
  }
</style>