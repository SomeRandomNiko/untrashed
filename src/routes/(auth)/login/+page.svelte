<script>
  import { enhance } from "$app/forms";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let { form } = $props();
</script>

<div class="form-container">
  <h1 class="text-xl">Login/Register</h1>
  <form method="post" action="?/login" use:enhance>
    <div class="form-group">
      <Label for="username">Username</Label>
      <Input id="username" name="username" />
    </div>
    <div class="form-group">
      <Label for="password">Password</Label>
      <Input id="password" type="password" name="password" />
    </div>
    <div class="button-group">
      <Button type="submit">Login</Button>
      <Button type="submit" formaction="?/register" variant="secondary">Register</Button>
    </div>
  </form>
  {#if form?.message}
    <p class="error-message">{form.message}</p>
  {/if}
</div>

<style>
  /* Center the form container */
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  /* Style the form */
  form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: var(--color-secondary); /* Use secondary color */
  }

  /* Style form groups */
  .form-group {
    margin-bottom: 1.5rem;
  }

  /* Align buttons */
  .button-group {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  /* Error message styling */
  .error-message {
    color: red;
    text-align: center;
    margin-top: 1rem;
  }

  /* Heading styling */
  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
