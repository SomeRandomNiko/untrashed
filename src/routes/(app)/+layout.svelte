<script>
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { ChevronUp } from "lucide-svelte";
  import "../../app.css";
  let { children, data } = $props();
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group />
      <Sidebar.Group />
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {data.user.username}
                  <ChevronUp class="ml-auto" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
              <a href="/logout">
                <DropdownMenu.Item class="cursor-pointer">Sign out</DropdownMenu.Item>
              </a>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu></Sidebar.Footer
    >
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
