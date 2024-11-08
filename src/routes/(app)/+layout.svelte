<script>
  import "./../../app.css";
  import { page } from "$app/stores";
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";

  let { children } = $props();
  let lastSegment = $state("");

  let latitude = $state(0);
  let longitude = $state(0);
  $effect(() => {
    if ($navigating) {
      lastSegment = $page.url.pathname.substring($page.url.pathname.lastIndexOf("/") + 1) || "home";
    }
  });
  onMount(() => {
    lastSegment = $page.url.pathname.substring($page.url.pathname.lastIndexOf("/") + 1) || "home";
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });
  });
</script>

<!-- Main content wrapper with padding to avoid overlap -->
<div class="content-wrapper">
  {@render children()}
</div>

<!-- Bottom Navigation Bar -->
<div class="bottom-nav h-16 w-full flex-row items-center justify-between bg-secondary">
  <!-- Home Button -->
  <a href="/" class="nav-item {lastSegment === 'home' ? 'text-green-800' : 'text-gray-500'}">
    <div><i class="fa-solid fa-home"></i></div>
    <span class="text-xs">Home</span>
  </a>

  <!-- Records Button -->
  <a
    href="/records"
    class="nav-item {lastSegment === 'records' ? 'text-green-800' : 'text-gray-500'}"
  >
    <div><i class="fa-solid fa-trash"></i></div>
    <span class="text-xs">Records</span>
  </a>

  <!-- Add Button (Centered and highlighted) -->
  <a
    href={`/catch`}
    class="nav-item {lastSegment === 'catch' ? 'text-green-800' : 'text-gray-500'}"
  >
    <div><i class="fa-solid fa-circle-plus"></i></div>
    <span class="text-xs">Add</span>
  </a>

  <!-- Cars Button -->
  <a href="/map" class="nav-item {lastSegment === 'map' ? 'text-green-800' : 'text-gray-500'}">
    <div><i class="fa-solid fa-map"></i></div>
    <span class="text-xs">Map</span>
  </a>

  <!-- User Button -->
  <a href="/user" class="nav-item {lastSegment === 'user' ? 'text-green-800' : 'text-gray-500'}">
    <div><i class="fa-solid fa-user"></i></div>
    <span class="text-xs">User</span>
  </a>
</div>

<style>
  /* Ensure the body takes up the full viewport height */
  :global(body) {
    margin: 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Content wrapper with bottom padding to avoid overlap */
  .content-wrapper {
    flex: 1;
    padding-bottom: 4rem; /* Adjust based on the height of the bottom nav */
  }

  /* Bottom Navigation Bar */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 10;
  }

  /* Navigation items styling */
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: color 0.2s;
  }
</style>
