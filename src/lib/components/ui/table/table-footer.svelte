<script>
  import { cn } from "$lib/utils.js";

  let { ref = $bindable(null), class: className, children, ...restProps } = $props();
</script>

<tfoot
  bind:this={ref}
  class={cn("bg-muted/50 font-medium text-primary-foreground", className)}
  {...restProps}
>
  {@render children?.()}
</tfoot>
