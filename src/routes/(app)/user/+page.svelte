<script>
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="vertical_alignment space-y-8">
  <Button href="" variant="secondary" class="w-5/6">Statistics</Button>
  <Button href="/logout" variant="destructive_light" class="w-5/6">Log Out</Button>
</div>

<style>
  .vertical_alignment {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 0rem 0rem 0rem 0rem;
  }
</style>
