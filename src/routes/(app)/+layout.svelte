<script>
  import { navigating, page } from "$app/stores";
  import { currentLocation } from "$lib/currentLocation";
  import "./../../app.css";

  let { children } = $props();
  let lastSegment = $state("");

  function locationCallback(position) {
    currentLocation.set([position.coords.longitude, position.coords.latitude]);
  }

  function errorCallback(error) {
    console.error("Error getting current location:", error);
    currentLocation.set(undefined);
  }

  const POSITION_OPTIONS = {
    enableHighAccuracy: true,
  };

  $effect(() => {
    if ($navigating) {
      lastSegment = $page.url.pathname.substring($page.url.pathname.lastIndexOf("/") + 1) || "home";
    }
  });

  $effect(() => {
    navigator.geolocation.getCurrentPosition(locationCallback, errorCallback, POSITION_OPTIONS);

    const watch = navigator.geolocation.watchPosition(
      locationCallback,
      errorCallback,
      POSITION_OPTIONS,
    );

    return () => {
      navigator.geolocation.clearWatch(watch);
      currentLocation.set([11.331995522990217, 46.47866974879552]);
    };
  });

  let searchParams = $derived.by(() => {
    const searchParams = new URLSearchParams();
    if ($currentLocation) {
      searchParams.set("location", $currentLocation.join(","));
    }
    return searchParams;
  });
</script>

<div class="flex h-dvh flex-col">
  <!-- Main content wrapper with padding to avoid overlap -->
  <div class="flex-grow overflow-y-auto overflow-x-hidden">
    {@render children()}
  </div>

  <!-- Bottom Navigation Bar -->
  <div
    class="bottom-nav h-16 w-full flex-shrink-0 flex-row items-center justify-between bg-secondary"
  >
    <!-- Home Button -->
    <a
      href="/home?{searchParams.toString()}"
      class="nav-item {lastSegment === 'home' ? 'text-primary' : 'text-gray-500'}"
    >
      <div><i class="fa-solid fa-home"></i></div>
      <span class="text-xs">Home</span>
    </a>

    <!-- Records Button -->
    <a
      href="/records?{searchParams.toString()}"
      class="nav-item {lastSegment === 'records' ? 'text-primary' : 'text-gray-500'}"
    >
      <div><i class="fa-solid fa-trash"></i></div>
      <span class="text-xs">Records</span>
    </a>

    <!-- Add Button (Centered and highlighted) -->
    <a
      href={`/catch`}
      class="nav-item {lastSegment === 'catch' ? 'text-primary' : 'text-gray-500'}"
    >
      <div><i class="fa-solid fa-circle-plus"></i></div>
      <span class="text-xs">Catch</span>
    </a>

    <!-- Cars Button -->
    <a href="/map" class="nav-item {lastSegment === 'map' ? 'text-primary' : 'text-gray-500'}">
      <div><i class="fa-solid fa-map"></i></div>
      <span class="text-xs">Map</span>
    </a>

    <!-- User Button -->
    <a href="/user" class="nav-item {lastSegment === 'user' ? 'text-primary' : 'text-gray-500'}">
      <div><i class="fa-solid fa-user"></i></div>
      <span class="text-xs">User</span>
    </a>
  </div>
</div>

<style>
  /* Ensure the body takes up the full viewport height */
  :global(body) {
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Bottom Navigation Bar */
  .bottom-nav {
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
