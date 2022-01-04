<script>
  export let onSubmit;

  let username;
  let password;

  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  }

  const handleUsernameInput = (e) => username = e.target.value;
  const handlePasswordInput = (e) => password = e.target.value;
</script>

<form on:submit={onFormSubmit}>
  <input type="text" name="username" on:input={handleUsernameInput} />
  <input type="password" name="password" on:input={handlePasswordInput} />
  <button type="submit">Submit</button>
</form>