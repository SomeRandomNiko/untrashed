<script>
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { currentLocation } from "$lib/currentLocation";
  let { record } = $props();
  const formatter = Intl.NumberFormat("en-US", {
    unit: record.distance > 1000 ? "kilometer" : "meter",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "unit",
  });

  let searchParams = $derived.by(() => {
    const searchParams = new URLSearchParams();
    if ($currentLocation) {
      searchParams.set("location", $currentLocation.join(","));
    }
    return searchParams;
  });
</script>

<Card.Root>
  <Card.Content>
    <div class="flex items-center justify-between">
      <Card.Title>{record.name}</Card.Title>
      <p>{formatter.format(record.distance > 1000 ? record.distance / 1000 : record.distance)}</p>
      <Button href="/map?{searchParams}" variant="outline">Map</Button>
      <Button href="/catch?record={record.id}" variant="outline">Resolve</Button>
    </div>
    <Accordion.Root type="single">
      <Accordion.Item value="item-1">
        <Accordion.Trigger>Show Details</Accordion.Trigger>
        <Accordion.Content>
          <figure class="text-center">
            <img
              src={record.image}
              alt="Image of a {record.name}"
              class="h-auto w-full rounded-lg"
            />
            <figcaption class="mt-2 text-gray-600">
              {record.description}
            </figcaption>
          </figure>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Card.Content>
</Card.Root>
