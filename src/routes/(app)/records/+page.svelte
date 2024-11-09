<script>
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Record from "./Record.svelte";

  let { data } = $props();
</script>

<div class="flex flex-col items-center gap-8 pt-6">
  <h1 class="text-2xl font-semibold tracking-tight">Records Page</h1>
  <Tabs.Root value="all" class="w-5/6">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="all">All</Tabs.Trigger>
      <Tabs.Trigger value="own">Own</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="all" class="space-y-2">
      {#each data.allTrashSpots as record}
        <Record {record} />
      {/each}
    </Tabs.Content>
    <Tabs.Content value="own" class="space-y-2">
      {#each data.ownTrashSpots as record}
        <Record {record} />
      {/each}
    </Tabs.Content>
  </Tabs.Root>
</div>
