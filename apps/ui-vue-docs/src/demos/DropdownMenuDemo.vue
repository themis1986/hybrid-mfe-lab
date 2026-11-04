<script setup lang="ts">
import {
  TButton,
  TCluster,
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuLabel,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
} from '@repo/ui-vue'
import { ref } from 'vue'

const action = ref('none yet')
</script>

<template>
  <TCluster>
    <TDropdownMenu>
      <TDropdownMenuTrigger as-child>
        <TButton variant="outline" label="Actions" />
      </TDropdownMenuTrigger>
      <TDropdownMenuContent>
        <TDropdownMenuLabel>Deployment</TDropdownMenuLabel>
        <TDropdownMenuItem @select="action = 'Restart'">
          Restart
        </TDropdownMenuItem>
        <TDropdownMenuItem @select="action = 'Roll back'">
          Roll back
        </TDropdownMenuItem>
        <TDropdownMenuItem disabled>Promote</TDropdownMenuItem>
        <TDropdownMenuSeparator />
        <TDropdownMenuItem tone="danger" @select="action = 'Delete'">
          Delete
        </TDropdownMenuItem>
      </TDropdownMenuContent>
    </TDropdownMenu>
    <span class="text-sm text-fg-muted">Last action: {{ action }}</span>
  </TCluster>
</template>
