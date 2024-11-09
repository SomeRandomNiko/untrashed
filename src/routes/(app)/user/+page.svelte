<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  let { data } = $props();

  const date = new Date();
  console.log(date.toUTCString());
  date.setDate(date.getDate() - 30);
  console.log(date.toUTCString());
</script>

<div class="flex h-full flex-col items-center justify-center gap-8">
  <Card.Root class="w-5/6">
    <Card.Header>
      <Card.Title>Statistics</Card.Title>
    </Card.Header>
    <Card.Content>
      <Table.Root>
        <Table.Body>
          {#each data.stats as stat}
            <Table.Row>
              <Table.Cell class="font-medium">{stat.message}</Table.Cell>
              <Table.Cell class="text-right">{stat.value}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
  <Button href="/logout" variant="destructive_light" class="w-5/6">Log Out</Button>
</div>

<style></style>
