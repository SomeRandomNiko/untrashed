<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let latitude = $state(0);
  let longitude = $state(0);
  onMount(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });
  });
</script>

<h1>Catch Page</h1>
