<script>
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  let { data } = $props();
  console.log(data.scores);
</script>

<div class="mt-6 flex flex-col items-center space-y-8">
  <h1 class="text-2xl font-semibold tracking-tight">Hey, {data.username}!</h1>
  <Card.Root class="w-5/6">
    <Card.Header>
      <Card.Title>Global Highscore</Card.Title>
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
          {#each data.scores as user}
            <Table.Row>
              <Table.Cell class="font-medium">{user.uname}</Table.Cell>
              <Table.Cell class="text-right">{user.score}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
</div>
