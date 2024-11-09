<script>
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  let { data } = $props();
</script>

<div class="flex flex-col items-center gap-8 pt-6">
  <h1 class="text-2xl font-semibold tracking-tight">Hey, {data.user.name}!</h1>
  <h5 class="text-xl font-semibold tracking-tight">Your total points: {data.user.score}</h5>
  <Card.Root class="w-5/6">
    <Card.Header>
      <Card.Title>Global Highscore</Card.Title>
    </Card.Header>
    <Card.Content>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[90px]">Position</Table.Head>
            <Table.Head class="w-[100px]">Username</Table.Head>
            <Table.Head class="text-right">Score</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.scores as user, idx}
            <Table.Row>
              <Table.Cell class="font-medium">{idx + 1}</Table.Cell>
              <Table.Cell class="font-medium">{user.uname}</Table.Cell>
              <Table.Cell class="text-right">{user.score}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
</div>
