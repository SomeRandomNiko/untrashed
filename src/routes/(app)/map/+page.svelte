<script>
  import { page } from "$app/stores";
  import { PUBLIC_MAPTILER_API_KEY } from "$env/static/public";
  import { currentLocation } from "$lib/currentLocation.js";
  import * as maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import { onDestroy, onMount } from "svelte";

  const { data } = $props();

  let mapDiv;
  let map;
  onMount(() => {
    let lng, lat;
    const location = $page.url.searchParams.get("location");
    if (location) {
      [lng, lat] = location.split(",").map(Number);
    }

    map = new maplibregl.Map({
      container: mapDiv,
      center: (location ? [lng, lat] : $currentLocation) || [11.4, 46.6],
      zoom: location ? 17 : 7,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
    });

    map.once("load", () => {
      map.addLayer({
        id: "points",
        type: "heatmap",
        source: {
          type: "geojson",
          data: data.trashSpots,
        },
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparency color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
        },
      });
    });
  });

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="flex h-full flex-col">
  <div class="flex-grow" bind:this={mapDiv}></div>
</div>
