<script>
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { currentLocation } from "$lib/currentLocation";
  import JSConfetti from "js-confetti";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  let videoElement;
  let canvasElement;
  let photoData = $state("");
  let photoTaken = $state(false);
  let appState = $state("none");
  let jsConfetti;

  function handleWarning(message) {
    appState = "error";
    toast.warning("Error", {
      description: message,
    });

    setTimeout(() => {
      appState = "none";
      retake();
    }, 2000);
  }

  function handleError(message) {
    appState = "error";
    toast.error("Error", {
      description: message,
    });

    setTimeout(() => {
      appState = "none";
      retake();
    }, 2000);
  }

  function handleSuccess(message) {
    toast.success("Success", {
      description: message,
    });

    setTimeout(() => {
      appState = "none";
      window.location.href = "/records?" + searchParams.toString();
    }, 2000);
  }

  let captureRecord = $state();
  // New variables for score display
  let displayScore = $state(null);
  let scoreTimeout;

  onMount(() => {
    if ($page.url.searchParams.has("record")) {
      captureRecord = +$page.url.searchParams.get("record");
    }
    jsConfetti = new JSConfetti();

    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  });

  let searchParams = $derived.by(() => {
    const searchParams = new URLSearchParams();
    if ($currentLocation) {
      searchParams.set("location", $currentLocation.join(","));
    }
    return searchParams;
  });

  /**
   * Take a photo
   */
  function takePhoto() {
    const context = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    photoData = canvasElement.toDataURL("image/png");
    photoTaken = true;

    // Stop the video stream
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
  }

  /**
   * Handle the "Catch" action
   */
  async function catchPhoto() {
    appState = "loading";
    try {
      if (captureRecord !== undefined) {
        const response = await fetch("/catch/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoData,
            captureRecord,
            latitude: $currentLocation[1],
            longitude: $currentLocation[0],
          }),
        });

        const result = await response.json();
        if (response.status === 200) {
          appState = "success";
          jsConfetti.addConfetti();

          // Display the score
          displayScore = result.score;

          // Set a timeout to hide the score after 1 second
          clearTimeout(scoreTimeout);
          scoreTimeout = setTimeout(() => {
            displayScore = null;
          }, 1000);

          handleSuccess("Photo captured successfully");
        } else if (response.status === 400) {
          handleWarning(result.error);
        }
      } else {
        const response = await fetch("/catch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoData,
            latitude: $currentLocation[1],
            longitude: $currentLocation[0],
          }),
        });

        const result = await response.json();
        if (response.status === 200) {
          appState = "success";
          jsConfetti.addConfetti();

          // Display the score
          displayScore = result.score;

          // Set a timeout to hide the score after 1 second
          clearTimeout(scoreTimeout);
          scoreTimeout = setTimeout(() => {
            displayScore = null;
          }, 1000);

          handleSuccess("Photo captured successfully");
        } else if (response.status === 400) {
          handleWarning(result.error);
        } else {
          handleError("There was an error capturing the photo");
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      handleError("Failed to reach the server");
    }
  }

  /**
   * Retake the photo
   */
  function retake() {
    photoTaken = false;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  }
</script>

<div class="relative flex h-full flex-col items-center justify-center text-center">
  <!-- Game Instructions -->
  <div class="max-w-md">
    {#if captureRecord}
      <h1 class="text-3xl font-bold">Confirm the Trash</h1>
    {:else}
      <h1 class="text-3xl font-bold">Catch the Trash</h1>
    {/if}
  </div>
  <Toaster position="top-center" richColors />

  <!-- Info dialog trigger positioned in the top-right corner -->
  <Dialog.Root>
    <Dialog.Trigger class="absolute right-4 top-4">
      <i class="fas fa-info-circle text-xl text-primary"></i>
    </Dialog.Trigger>
    <Dialog.Content class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <Dialog.Header class="mb-4">
        <Dialog.Title class="mb-2 text-2xl font-bold">Rewards</Dialog.Title>
        <Dialog.Description class="max-h-96 overflow-y-auto text-gray-700">
          <ul>
            <li>
              <strong>Category Weighting:</strong> Each trash category has a specific weight,
              multiplied by 5 to determine its score impact:
              <ul>
                <li>Organic: Weight of 1</li>
                <li>Paper: Weight of 2</li>
                <li>Glass: Weight of 3</li>
                <li>Metal: Weight of 4</li>
                <li>Household: Weight of 5</li>
                <li>Electronics: Weight of 6</li>
              </ul>
            </li>
            <br />
            <li>
              <strong>Impact Weighting:</strong> Reflects the environmental impact level of the
              trash, multiplied by 10 for the highest influence:
              <ul>
                <li>Low Impact: Weight of 1</li>
                <li>Medium Impact: Weight of 2</li>
                <li>High Impact: Weight of 3</li>
              </ul>
            </li>
            <br />
            <li>
              <strong>Size Weighting:</strong> Reflects the physical size of the trash item,
              multiplied by 3 for moderate influence on the score:
              <br />
              <ul>
                <li>Small: Weight of 1</li>
                <li>Medium: Weight of 2</li>
                <li>Large: Weight of 3</li>
              </ul>
            </li>
            <br />
            <li>
              <strong>Score Calculation:</strong>
              <ul>
                <li>
                  The total score is calculated as:
                  <br /><b
                    ><code>baseScore = categoryWeight * 5 + impactWeight * 10 + sizeWeight * 3</code
                    ></b
                  >
                </li>
                <li>
                  This prioritizes <em>Impact</em> first, then <em>Category</em>, and finally
                  <em>Size</em>.
                </li>
              </ul>
            </li>
            <br />
            <li>
              <strong>Minimum Score:</strong>
              <ul>
                <li>
                  A fixed score of 5 point is assigned when catching and minimum score of 10 is
                  applied.
                </li>
              </ul>
            </li>
          </ul>
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer class="flex justify-end">
        <Dialog.Close class="rounded bg-primary px-4 py-2 text-white">Close</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  {#if appState !== "loading"}
    <!-- Game Instructions -->
    <div class="max-w-md">
      <p class="text-md text-gray-600">
        Scan trash using your camera, confirm it, and earn rewards for each item you capture. (Don't
        forget to verify them in the records page!)
      </p>
    </div>
    {#if !photoTaken}
      <div class="flex flex-col items-center space-y-4">
        <video
          bind:this={videoElement}
          autoplay
          playsinline
          class="w-full max-w-md rounded-lg shadow-lg"
        ></video>
        <Button onclick={takePhoto} class="h-24 w-24 rounded-full text-lg">Capture</Button>
      </div>
    {/if}
    {#if photoTaken}
      <div class="flex flex-col items-center space-y-4">
        <img src={photoData} alt="Captured Photo" class="w-full max-w-md rounded-lg shadow-lg" />
        {#if appState === "none"}
          <div class="mt-4 flex flex-col items-center space-y-4">
            <Button onclick={catchPhoto} class="w-20">{captureRecord ? "Confirm" : "Catch"}</Button>
            <Button onclick={retake} variant="outline" class="w-20">Retake</Button>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="flex flex-col items-center space-y-4">
      <i class="fas fa-trash fa-spin text-6xl text-primary"></i>
      <p class="text-lg font-medium">Catching...</p>
    </div>
  {/if}

  <!-- Score Display -->
  {#if displayScore !== null}
    <div
      class="absolute inset-0 flex items-center justify-center"
      transition:fade={{ duration: 300, easing: cubicOut }}
    >
      <div class="text-9xl font-bold text-green-500">
        +{displayScore}
      </div>
    </div>
  {/if}

  <!-- Hidden canvas element -->
  <canvas bind:this={canvasElement} style="display: none;"></canvas>
</div>

<style>
  video,
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
</style>
