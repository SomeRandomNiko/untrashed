<script>
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import JSConfetti from "js-confetti";

  let latitude = 0;
  let longitude = 0;
  let videoElement;
  let canvasElement;
  let photoData = "";
  let photoTaken = false;
  let state = "none";
  const jsConfetti = new JSConfetti();

  onMount(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    });

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
    state = "loading";
    try {
      const response = await fetch("/catch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoData,
          latitude,
          longitude,
        }),
      });

      if (response.status === 200) {
        state = "success";
        jsConfetti.addConfetti();
        toast.success("Success", {
          description: "Photo captured successfully",
        });
      } else if (response.status === 400) {
        state = "error";
        toast.warning("Error", {
          description: "The photo does not contain any trash",
        });
      } else {
        state = "error";
        toast.error("Error", {
          description: "There was an error capturing the photo",
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      state = "error";
      toast.error("Error", {
        description: "Failed to reach the server",
      });
    } finally {
      setTimeout(() => {
        state = "none";
        retake();
      }, 2000);
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

<div class="flex h-full flex-col items-center justify-center space-y-8 text-center">
  <!-- Game Instructions -->
  <div class="max-w-md">
    <p class="text-lg text-gray-600">
      Scan trash using your camera, confirm it, and earn rewards for each item you capture. (Don't
      forget to verify them in the records page!)
    </p>
  </div>
  <Toaster position="top-center" richColors />

  <!-- Info dialog trigger positioned in the top-right corner -->
  <Dialog.Root>
    <Dialog.Trigger class="absolute right-4 top-4">
      <i class="fas fa-info-circle text-xl text-primary"></i>
    </Dialog.Trigger>
    <Dialog.Content class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <Dialog.Header class="mb-4">
        <Dialog.Title class="mb-2 text-2xl font-bold">Trash Rewards</Dialog.Title>
        <Dialog.Description class="text-gray-700">
          <ul class="list-inside list-none">
            <li>Plastic Trash: 5 points</li>
            <li>Paper Trash: 10 points</li>
            <li>Metal Trash: 15 points</li>
            <li>Glass Trash: 20 points</li>
            <li>Organic Trash: 25 points</li>
          </ul>
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer class="mt-4 flex justify-end">
        <Dialog.Close class="rounded bg-primary px-4 py-2 text-white">Close</Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  {#if state !== "loading"}
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
        {#if state === "none"}
          <div class="mt-4 flex flex-col items-center space-y-4">
            <Button onclick={catchPhoto} class="w-20">Catch</Button>
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
