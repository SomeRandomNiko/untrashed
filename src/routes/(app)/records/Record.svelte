<script>
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  let { record } = $props();
</script>

<Card.Root>
  <Card.Content>
    <div class="flex items-center justify-between">
      <Card.Title>{record.data.name}</Card.Title>
      <p>{record.data.distance}m</p>
      <Button href="/map?lat={record.lat}&long={record.long}" variant="outline">Map</Button>
      <Button variant="outline">Resolve</Button>
    </div>
    <Accordion.Root type="single">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Description</Accordion.Trigger>
        <Accordion.Content>
          <figure class="text-center">
            <img
              src={record.data.image}
              alt="Image of a {record.data.name}"
              class="h-auto w-full rounded-lg"
            />
            <figcaption class="mt-2 text-gray-600">
              {record.data.description}
            </figcaption>
          </figure>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Card.Content>
</Card.Root>
