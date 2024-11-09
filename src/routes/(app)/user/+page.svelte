<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  let { data } = $props();
  console.log(data.scores);
  console.log(data.found);
  console.log(data.disposed);
  console.log("Total points: " + data.score);
</script>

<div class="flex h-full flex-col items-center justify-center space-y-8">
  <Card.Root class="w-5/6">
    <Card.Header>
      <Card.Title>Statistics</Card.Title>
    </Card.Header>
    <Card.Content>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[100px]">Username</Table.Head>
            <Table.Head class="text-right">Score</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell class="font-medium">1</Table.Cell>
            <Table.Cell class="text-right">1</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
  <Button href="" variant="secondary" class="w-5/6">Statistics</Button>
  <Button href="/logout" variant="destructive_light" class="w-5/6">Log Out</Button>
</div>

<style></style>
