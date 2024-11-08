<script>
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { Toaster } from "$lib/components/ui/sonner/index.js";

  let latitude = 0;
  let longitude = 0;
  let videoElement;
  let canvasElement;
  let photoData = "";
  let photoTaken = false;
  let state = "none";

  onMount(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });

    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
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
  function catchPhoto() {
    state = "loading";
    setTimeout(() => {
      // Simulate success or error randomly
      if (Math.random() < 0.5) {
        // Success case
        state = "success";
        toast.success("Success", {
          description: "Photo captured successfully",
        });
      } else {
        // Error case
        state = "error";
        toast.error("Error", {
          description: "There was an error capturing the photo",
        });
      }
      setTimeout(() => {
        state = "none";
        retake();
      }, 2000);
    }, 2000);
  }

  /**
   * Retake the photo
   */
  function retake() {
    photoTaken = false;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  }
</script>

<div class="flex h-full items-center justify-center bg-gray-100">
  <Toaster position="top-center" richColors />
  {#if state !== "loading"}
    {#if !photoTaken}
      <div class="flex flex-col items-center space-y-4">
        <video
          bind:this={videoElement}
          autoplay
          playsinline
          class="w-full max-w-md rounded-lg shadow-lg"
        ></video>
        <Button onclick={takePhoto}>Capture</Button>
      </div>
    {/if}
    {#if photoTaken}
      <div class="flex flex-col items-center space-y-4">
        <img src={photoData} alt="Captured Photo" class="w-full max-w-md rounded-lg shadow-lg" />
        <div class="flex space-x-4">
          <Button onclick={catchPhoto}>Catch</Button>
          <Button onclick={retake} variant="outline">Retake</Button>
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex flex-col items-center space-y-4">
      <i class="fas fa-trash fa-spin text-6xl text-primary"></i>
      <p class="text-lg font-medium">Catching...</p>
    </div>
  {/if}
</div>

<!-- Hidden canvas element -->
<canvas bind:this={canvasElement} style="display: none;"></canvas>

<style>
  video,
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: auto;
  }
</style>
